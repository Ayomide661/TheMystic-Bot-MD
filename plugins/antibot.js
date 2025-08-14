import { WAMessageStubType } from '@whiskeysockets/baileys'

const handler = async (m, { conn, args, isAdmin, isOwner }) => {
    if (!isAdmin && !isOwner) {
        return m.reply('❌ This command requires admin privileges')
    }

    // Initialize antibot list if it doesn't exist
    if (!global.antibot) global.antibot = {}
    if (!global.antibot[m.chat]) global.antibot[m.chat] = []

    if (!args[0]) {
        // Show current monitored users
        const list = global.antibot[m.chat].length 
            ? global.antibot[m.chat].map(jid => `• @${jid.split('@')[0]}`).join('\n')
            : 'No users being monitored'
        return m.reply(
            `🚫 *AntiBot Monitoring*\n\n` +
            `Current monitored users:\n${list}\n\n` +
            `Usage:\n` +
            `• Add: !antibot add @user\n` +
            `• Remove: !antibot remove @user\n` +
            `• Clear all: !antibot clear`,
            null, 
            { mentions: global.antibot[m.chat] }
        )
    }

    const action = args[0].toLowerCase()
    const targets = m.mentionedJid.filter(jid => jid !== conn.user.jid)

    switch (action) {
        case 'add':
            if (!targets.length) return m.reply('Please mention users to add')
            global.antibot[m.chat] = [...new Set([...global.antibot[m.chat], ...targets])]
            m.reply(`✅ Added ${targets.length} user(s) to monitoring list`)
            break

        case 'remove':
            if (!targets.length) return m.reply('Please mention users to remove')
            global.antibot[m.chat] = global.antibot[m.chat].filter(jid => !targets.includes(jid))
            m.reply(`✅ Removed ${targets.length} user(s) from monitoring list`)
            break

        case 'clear':
            global.antibot[m.chat] = []
            m.reply('✅ Cleared all monitored users')
            break

        default:
            m.reply('Invalid command. Use !antibot help for usage')
    }
}

// Message event handler
export async function all(m) {
    // Skip if not a group or antibot not initialized
    if (!m.isGroup || !global.antibot?.[m.chat]) return
    
    // Skip if message is from admin or not in monitored list
    const isAdmin = await (async () => {
        try {
            const metadata = await this.groupMetadata(m.chat)
            return metadata.participants.find(p => p.id === m.sender)?.admin
        } catch {
            return false
        }
    })()
    
    if (isAdmin || !global.antibot[m.chat].includes(m.sender)) return
    
    // Skip important system messages
    if ([
        WAMessageStubType.GROUP_PARTICIPANT_LEAVE,
        WAMessageStubType.GROUP_PARTICIPANT_REMOVE,
        WAMessageStubType.GROUP_CHANGE_ANNOUNCE,
        WAMessageStubType.GROUP_CHANGE_SUBJECT,
        WAMessageStubType.GROUP_CHANGE_ICON
    ].includes(m.messageStubType)) return

    try {
        // Delete the message
        await this.sendMessage(m.chat, {
            delete: {
                id: m.key.id,
                remoteJid: m.chat,
                fromMe: false,
                participant: m.sender
            }
        })
        
        // Optional: Notify about deletion
        await this.sendMessage(m.chat, {
            text: `🚫 Message from @${m.sender.split('@')[0]} was automatically deleted`,
            mentions: [m.sender]
        }, { quoted: m })
    } catch (error) {
        console.error('AntiBot deletion error:', error)
    }
}

handler.help = ['antibot [add/remove/clear] @user']
handler.tags = ['group']
handler.command = ['antibot']
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler