import { generateWAMessageFromContent, prepareWAMessageMedia, proto } from '@whiskeysockets/baileys'

const handler = async (m, { conn, args, isAdmin, isOwner }) => {
    // Verify admin permissions
    if (!isAdmin && !isOwner) {
        return m.reply('❌ This command requires admin privileges')
    }

    // Check for JID input
    if (!args[0]) {
        return m.reply(`🔍 Please provide a JID or multiple JIDs separated by commas\n\nExample: *${usedPrefix + command} 1234567890@s.whatsapp.net, 9876543210@s.whatsapp.net*`)
    }

    try {
        // Process JIDs
        const jids = args[0].split(',')
            .map(jid => jid.trim())
            .filter(jid => jid.endsWith('@s.whatsapp.net') || jid.endsWith('@c.us'))

        if (jids.length === 0) {
            return m.reply('❌ No valid JIDs found. Format must end with @s.whatsapp.net or @c.us')
        }

        // Verify JIDs exist on WhatsApp
        const verifiedJids = (await Promise.all(
            jids.map(async jid => {
                const [result] = await conn.onWhatsApp(jid)
                return result?.exists ? result.jid : null
            })
        )).filter(Boolean)

        if (verifiedJids.length === 0) {
            return m.reply('⚠️ None of the provided JIDs are registered on WhatsApp')
        }

        // Add users to group
        const response = await conn.groupParticipantsUpdate(
            m.chat,
            verifiedJids,
            'add'
        )

        // Handle results
        const added = response.filter(r => r.status === '200').map(r => r.jid)
        const failed = response.filter(r => r.status !== '200')

        // Send success report
        if (added.length > 0) {
            await m.reply(`✅ Successfully added:\n${added.map(jid => `• ${jid.replace(/@.+/, '')}`.join('\n')}`)
        }

        // Handle restricted users with invites
        for (const fail of failed) {
            if (fail.status === '403') {
                const inviteCode = await conn.groupInviteCode(m.chat)
                const inviteLink = `https://chat.whatsapp.com/${inviteCode}`
                
                // Notify group
                await m.reply(
                    `📨 Sent invite to @${fail.jid.replace(/@.+/, '')} (privacy settings prevent direct add)`,
                    null,
                    { mentions: [fail.jid] }
                )
                
                // Send invite privately
                await conn.sendMessage(
                    fail.jid,
                    {
                        text: `📩 You've been invited to join *${await conn.getName(m.chat)}*\n\n${inviteLink}`,
                        templateButtons: [
                            { urlButton: { displayText: 'Join Group', url: inviteLink } },
                            { quickReplyButton: { displayText: 'Thanks!', id: 'thanks' } }
                        ]
                    }
                )
            }
        }

    } catch (error) {
        console.error('Add JID Error:', error)
        m.reply('❌ Failed to process JIDs. Please try again later.')
    }
}

handler.help = ['addjid <jid1,jid2,...>']
handler.tags = ['group']
handler.command = ['addjid', 'addjids']
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler