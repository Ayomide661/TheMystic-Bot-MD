import mysql from 'mysql2/promise';

// MySQL Database Configuration
const dbConfig = {
    host: 'mysql.db.bot-hosting.net',
    port: 3306,
    user: 'u459053_sLEdgAjDcz',
    password: 'SvDJY@4bc7c3!U@Uh5DtJjlQ',
    database: 's459053_Mystic'
};

// Create database connection pool
const pool = mysql.createPool({
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Initialize database tables
async function initDatabase() {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.query(`
            CREATE TABLE IF NOT EXISTS restricted_users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                group_id VARCHAR(255) NOT NULL,
                user_id VARCHAR(255) NOT NULL,
                restricted_by VARCHAR(255) NOT NULL,
                restricted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY unique_restriction (group_id, user_id)
            )
        `);
        console.log('Database tables initialized');
    } catch (error) {
        console.error('Database initialization error:', error);
    } finally {
        if (conn) conn.release();
    }
}

// Initialize database on startup
initDatabase();

const handler = async (m, { conn, args, usedPrefix, command }) => {
    let mysqlConn;
    try {
        console.log('[Restrict-Bot] Command received:', command, 'with args:', args);
        
        // Check if in group
        if (!m.isGroup) {
            console.log('[Restrict-Bot] Not a group chat');
            return m.reply('❌ This command can only be used in groups!');
        }

        // Get sender's admin status
        const metadata = await conn.groupMetadata(m.chat);
        const participant = metadata.participants.find(p => p.id === m.sender);
        
        if (!participant) {
            console.log('[Restrict-Bot] Participant not found in group');
            return m.reply('❌ Could not verify your group status.');
        }

        const isAdmin = participant.admin === 'admin' || participant.admin === 'superadmin';
        
        if (!isAdmin) {
            console.log('[Restrict-Bot] User is not admin');
            return m.reply('❌ Only admins can use this command!');
        }

        const action = args[0]?.toLowerCase();
        const mentioned = m.mentionedJid[0];
        const groupId = m.chat;

        console.log('[Restrict-Bot] Action:', action, 'Mentioned:', mentioned);

        mysqlConn = await pool.getConnection();

        switch (action) {
            case 'add':
                if (!mentioned) {
                    console.log('[Restrict-Bot] No user mentioned');
                    return m.reply('❌ Please mention a user to restrict!\nExample: .restrict-bot add @user');
                }

                // Check if already restricted
                const [existing] = await mysqlConn.query(
                    'SELECT * FROM restricted_users WHERE group_id = ? AND user_id = ?',
                    [groupId, mentioned]
                );

                if (existing.length > 0) {
                    console.log('[Restrict-Bot] User already restricted');
                    return m.reply(`❌ @${mentioned.split('@')[0]} is already restricted!`, null, { mentions: [mentioned] });
                }

                // Add to restricted list
                await mysqlConn.query(
                    'INSERT INTO restricted_users (group_id, user_id, restricted_by) VALUES (?, ?, ?)',
                    [groupId, mentioned, m.sender]
                );

                console.log('[Restrict-Bot] User restricted:', mentioned);
                return m.reply(
                    `✅ User @${mentioned.split('@')[0]} has been restricted - their messages will be auto-deleted.`,
                    null,
                    { mentions: [mentioned] }
                );

            case 'remove':
                if (!mentioned) {
                    console.log('[Restrict-Bot] No user mentioned');
                    return m.reply('❌ Please mention a user to unrestrict!\nExample: .restrict-bot remove @user');
                }

                // Check if user is restricted
                const [result] = await mysqlConn.query(
                    'DELETE FROM restricted_users WHERE group_id = ? AND user_id = ?',
                    [groupId, mentioned]
                );

                if (result.affectedRows === 0) {
                    console.log('[Restrict-Bot] User not restricted');
                    return m.reply(`❌ @${mentioned.split('@')[0]} is not restricted!`, null, { mentions: [mentioned] });
                }

                console.log('[Restrict-Bot] User unrestricted:', mentioned);
                return m.reply(
                    `✅ User @${mentioned.split('@')[0]} has been unrestricted.`,
                    null,
                    { mentions: [mentioned] }
                );

            case 'list':
                console.log('[Restrict-Bot] Listing restricted users');
                const [restricted] = await mysqlConn.query(
                    'SELECT user_id FROM restricted_users WHERE group_id = ?',
                    [groupId]
                );

                if (restricted.length === 0) {
                    return m.reply('ℹ️ No users are currently restricted in this group.');
                }

                let list = '🚫 *Restricted Users*:\n';
                restricted.forEach(user => {
                    list += `▸ @${user.user_id.split('@')[0]}\n`;
                });
                return m.reply(
                    list,
                    null,
                    { mentions: restricted.map(u => u.user_id) }
                );

            default:
                console.log('[Restrict-Bot] Invalid action');
                const helpText = `📝 *Restrict-Bot Usage*:

🔒 Restrict a user:
${usedPrefix}restrict-bot add @user

🔓 Unrestrict a user:
${usedPrefix}restrict-bot remove @user

📋 List restricted users:
${usedPrefix}restrict-bot list`;
                return m.reply(helpText);
        }
    } catch (error) {
        console.error('[Restrict-Bot] Handler error:', error);
        return m.reply('❌ An error occurred while processing your command. Please try again later.');
    } finally {
        if (mysqlConn) mysqlConn.release();
    }
};

// Message deletion handler
export async function all(m, { conn }) {
    let mysqlConn;
    try {
        // Only process in groups
        if (!m.isGroup) return;
        
        mysqlConn = await pool.getConnection();

        // Check if sender is restricted in this group
        const [results] = await mysqlConn.query(
            'SELECT 1 FROM restricted_users WHERE group_id = ? AND user_id = ?',
            [m.chat, m.sender]
        );

        if (results.length > 0) {
            console.log('[Restrict-Bot] Deleting message from restricted user:', m.sender);
            
            try {
                // Delete the message
                await conn.sendMessage(m.chat, {
                    delete: {
                        remoteJid: m.chat,
                        fromMe: false,
                        id: m.id,
                        participant: m.sender
                    }
                });
                
                // Notify admins (optional)
                const metadata = await conn.groupMetadata(m.chat);
                const admins = metadata.participants
                    .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
                    .map(p => p.id);
                
                if (admins.includes(conn.user.jid)) {
                    await conn.sendMessage(m.chat, {
                        text: `🚫 Deleted message from restricted user @${m.sender.split('@')[0]}`,
                        mentions: [m.sender]
                    }, { quoted: m });
                }
            } catch (deleteError) {
                console.error('[Restrict-Bot] Delete error:', deleteError);
            }
        }
    } catch (error) {
        console.error('[Restrict-Bot] All handler error:', error);
    } finally {
        if (mysqlConn) mysqlConn.release();
    }
}

handler.help = ['restrict-bot <add/remove/list> @user'];
handler.tags = ['group', 'moderation'];
handler.command = /^restrict-bot$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;