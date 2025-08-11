import { generateWAMessageFromContent, prepareWAMessageMedia, proto } from '@whiskeysockets/baileys'

const handler = async (m, { conn, args, usedPrefix, command, isAdmin, isOwner }) => {
    if (!isAdmin && !isOwner) return m.reply('❌ Admin only!')
    if (!args[0]) return m.reply(`Usage: *${usedPrefix + command} jid1,jid2,...*`)

    try {
        const jids = args[0].split(',')
            .map(jid => jid.trim().replace(/[^0-9]/g, '') + '@s.whatsapp.net')

        const verified = (await Promise.all(
            jids.map(async jid => {
                const [result] = await conn.onWhatsApp(jid)
                return result?.exists ? jid : null
            })
        )).filter(Boolean)

        if (!verified.length) return m.reply('❌ No valid JIDs found')

        const results = await conn.groupParticipantsUpdate(m.chat, verified, 'add')
        
        // Success report
        const added = results.filter(r => r.status === '200').map(r => r.jid)
        if (added.length) {
            await m.reply(`✅ Added:\n${added.map(jid => `• ${jid.split('@')[0]}`.join('\n')}`)
        }

        // Handle restricted users
        for (const { jid, status } of results) {
            if (status === '403') {
                const inviteCode = await conn.groupInviteCode(m.chat)
                await conn.sendMessage(
                    jid, 
                    { 
                        text: `📩 Join: ${await conn.getName(m.chat)}\n\nhttps://chat.whatsapp.com/${inviteCode}`,
                        templateButtons: [{
                            urlButton: {
                                displayText: 'Join Group',
                                url: `https://chat.whatsapp.com/${inviteCode}`
                            }
                        }]
                    }
                )
                await m.reply(`📨 Invite sent to @${jid.split('@')[0]}`, null, { mentions: [jid] })
            }
        }

    } catch (error) {
        console.error('AddJID Error:', error)
        m.reply('❌ Failed: ' + error.message)
    }
}

handler.help = ['addjid <jids>']
handler.tags = ['group']
handler.command = ['addjid', 'invitejid']
handler.admin = handler.group = handler.botAdmin = true

export default handler