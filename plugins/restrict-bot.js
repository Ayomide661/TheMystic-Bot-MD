import db from '../lib/database.js';

const handler = async (m, { conn, args, usedPrefix, command }) => {
    // Check if the command is being used in a group
    if (!m.isGroup) {
        return m.reply('This command can only be used in groups!');
    }

    // Check if the user is an admin
    const isAdmin = m.participants.find(p => p.id === m.sender)?.admin || false;
    if (!isAdmin) {
        return m.reply('Only admins can use this command!');
    }

    // Command structure: .restrict-bot [add/remove/list] [@participant]
    const action = args[0]?.toLowerCase();
    const mentioned = m.mentionedJid[0];

    switch (action) {
        case 'add':
            if (!mentioned) return m.reply('Please mention a user to restrict!');
            if (db.data.restrictedUsers.includes(mentioned)) {
                return m.reply('User is already restricted!');
            }
            db.data.restrictedUsers.push(mentioned);
            m.reply(`User @${mentioned.split('@')[0]} has been restricted - their messages will be auto-deleted.`);
            break;

        case 'remove':
            if (!mentioned) return m.reply('Please mention a user to unrestrict!');
            if (!db.data.restrictedUsers.includes(mentioned)) {
                return m.reply('User is not restricted!');
            }
            db.data.restrictedUsers = db.data.restrictedUsers.filter(u => u !== mentioned);
            m.reply(`User @${mentioned.split('@')[0]} has been unrestricted.`);
            break;

        case 'list':
            if (db.data.restrictedUsers.length === 0) {
                return m.reply('No users are currently restricted.');
            }
            let list = '🚫 *Restricted Users*:\n';
            db.data.restrictedUsers.forEach(user => {
                list += `- @${user.split('@')[0]}\n`;
            });
            m.reply(list, null, { mentions: db.data.restrictedUsers });
            break;

        default:
            m.reply(`Usage:\n${usedPrefix}restrict-bot add @user\n${usedPrefix}restrict-bot remove @user\n${usedPrefix}restrict-bot list`);
    }
};

// Message deletion handler
export async function all(m, { conn }) {
    // Only process in groups
    if (!m.isGroup) return;

    // Check if sender is restricted
    if (db.data.restrictedUsers?.includes(m.sender)) {
        try {
            // Delete the message immediately
            await conn.sendMessage(m.chat, {
                delete: {
                    remoteJid: m.chat,
                    fromMe: false,
                    id: m.id,
                    participant: m.sender
                }
            });
            
            // Optional: Notify admins about the deletion
            const admins = (await conn.groupMetadata(m.chat)).participants
                .filter(p => p.admin)
                .map(p => p.id);
                
            if (admins.includes(conn.user.jid)) {
                await conn.sendMessage(m.chat, {
                    text: `🚫 Deleted a message from restricted user @${m.sender.split('@')[0]}`,
                    mentions: [m.sender]
                }, { quoted: m });
            }
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    }
}

handler.help = ['restrict-bot <add/remove/list> @user'];
handler.tags = ['group'];
handler.command = /^restrict-bot$/i;
handler.group = true;
handler.admin = true;

export default handler;