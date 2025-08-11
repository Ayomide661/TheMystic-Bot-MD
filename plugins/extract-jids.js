const handler = async (m, { conn, args, usedPrefix, command, isAdmin, isOwner }) => {
    // Only allow bot owner or admins to use this command
    if (!isOwner && !isAdmin) {
        return m.reply('❌ This command can only be used by the bot owner or group admins!');
    }

    // Check if group JID was provided
    if (!args[0]) {
        return m.reply(`🔍 Please provide a group JID\n\nExample: ${usedPrefix + command} 120363400027023352@g.us`);
    }

    const groupJid = args[0].trim();
    
    // Validate if it's a group JID format
    if (!groupJid.endsWith('@g.us')) {
        return m.reply('❌ Invalid group JID format. It should end with @g.us');
    }

    try {
        // Fetch group metadata
        const groupMetadata = await conn.groupMetadata(groupJid).catch(e => {
            console.error('Error fetching group metadata:', e);
            throw new Error('Failed to fetch group metadata. Make sure the bot is in that group.');
        });

        // Extract participant JIDs
        const participants = groupMetadata.participants.map(p => p.id);
        
        // Format the output
        let result = `📋 *Group Members JIDs* 📋\n\n`;
        result += `🔹 *Group JID:* ${groupJid}\n`;
        result += `🔹 *Total Members:* ${participants.length}\n\n`;
        result += `👥 *Member JIDs:*\n${participants.join('\n')}`;

        // Send as a text file if too long
        if (result.length > 1000) {
            return conn.sendMessage(m.chat, {
                document: Buffer.from(result),
                mimetype: 'text/plain',
                fileName: `group_members_${groupJid.split('@')[0]}.txt`
            }, { quoted: m });
        }

        return m.reply(result);
    } catch (error) {
        console.error('Error in extract-jids plugin:', error);
        return m.reply(`❌ Error: ${error.message || 'Failed to extract JIDs'}`);
    }
};

handler.help = ['extractjids <group-jid>'];
handler.tags = ['group'];
handler.command = /^(extractjids|getjids|memberjids)$/i;
handler.admin = true; // Only admins can use this
handler.owner = true; // Bot owner can also use this

export default handler;