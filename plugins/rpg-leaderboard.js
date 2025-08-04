const handler = async (m, { conn, args }) => {
    try {
        // Debugging: Check registration status first
        const senderData = global.db.data.users[m.sender];
        if (!senderData?.registered) {
            return conn.reply(m.chat, 
                `⚠️ You need to register first!\n\nUse: *${usedPrefix}register [name.age]*\nExample: *${usedPrefix}register Shadow.18*`,
                m
            );
        }

        // Get all potential users
        const potentialUsers = Object.entries(global.db.data.users)
            .filter(([jid]) => jid.endsWith('@s.whatsapp.net'))
            .map(([jid, user]) => ({
                jid,
                name: conn.getName(jid),
                registered: Boolean(user.registered), // Force boolean conversion
                exp: Math.floor(Number(user.exp) || 0),
                limit: Math.floor(Number(user.limit) || 0),
                level: Math.floor(Number(user.level) || 0),
                lastUpdated: user.lastUpdated || 0
            }));

        // Filter for properly registered users
        const registeredUsers = potentialUsers.filter(user => {
            return user.registered && 
                   !isNaN(user.exp) && 
                   !isNaN(user.limit) && 
                   !isNaN(user.level);
        });

        // Enhanced debug information
        if (registeredUsers.length === 0) {
            const debugInfo = `
            🐛 Debug Information:
            • Total Users: ${potentialUsers.length}
            • Registered Count: ${potentialUsers.filter(u => u.registered).length}
            • Your Status: ${senderData?.registered ? '✅ Registered' : '❌ Not registered'}
            • Database Path: ${global.db.__path || 'Memory Database'}`;

            console.log(debugInfo);
            return conn.reply(m.chat, 
                `📊 Leaderboard Empty\n\nNo registered adventurers found!\n${debugInfo}`,
                m
            );
        }

        // Sort categories with fallbacks
        const sorted = {
            exp: [...registeredUsers].sort((a, b) => b.exp - a.exp || b.lastUpdated - a.lastUpdated),
            diamonds: [...registeredUsers].sort((a, b) => b.limit - a.limit || b.lastUpdated - a.lastUpdated),
            levels: [...registeredUsers].sort((a, b) => b.level - a.level || b.lastUpdated - a.lastUpdated)
        };

        // Dynamic length with limits (5-15)
        const len = Math.min(Math.max(args[0] ? parseInt(args[0]) : 10, 5), 15);

        // Visual progress bar with colors
        const createProgressBar = (value, max) => {
            const percentage = max > 0 ? Math.min(value / max, 1) : 0;
            const bars = 12;
            const filled = Math.round(percentage * bars);
            const colors = ['🔴', '🟠', '🟡', '🟢', '🔵'];
            const colorIndex = Math.min(Math.floor(percentage * colors.length), colors.length - 1);
            return `${colors[colorIndex]} ${'█'.repeat(filled)}${'░'.repeat(bars - filled)} ${Math.round(percentage * 100)}%`;
        };

        // Leaderboard section generator
        const createSection = (title, icon, data, key) => {
            const topValue = data[0]?.[key] || 1;
            return `
┣━━〘 ${icon} ${title.padEnd(10)}〙━━⬣
${data.slice(0, len).map((user, i) => {
    const rank = `${i + 1}.`.padEnd(3);
    const displayName = (user.name || user.jid.split('@')[0]).substring(0, 12).padEnd(12);
    const value = `${user[key].toLocaleString()}`.padEnd(6);
    return `┃ ${rank} ${displayName} ${value}\n┃   ${createProgressBar(user[key], topValue)}`;
}).join('\n')}`;
        };

        // Get user's position with fallback
        const getRank = (list, jid) => {
            const index = list.findIndex(u => u.jid === jid);
            return index >= 0 ? index + 1 : '--';
        };

        // Compose final message
        const message = `╭━━〘 🏆 LEADERBOARD 〙━━⬣
┃ 📅 ${new Date().toLocaleDateString()} | 👥 ${registeredUsers.length} Registered
${createSection('EXPERIENCE', '🌟', sorted.exp, 'exp')}
${createSection('DIAMONDS', '💎', sorted.diamonds, 'limit')}
${createSection('LEVELS', '🎚️', sorted.levels, 'level')}
┃
┣━━〘 YOUR STATS 〙━━⬣
┃ • 🌟 EXP: #${getRank(sorted.exp, m.sender)} (${senderData.exp || 0})
┃ • 💎 Diamonds: #${getRank(sorted.diamonds, m.sender)} (${senderData.limit || 0})
┃ • 🎚️ Level: #${getRank(sorted.levels, m.sender)} (${senderData.level || 0})
┃
╰━━━━━━━━━━━━━━━━━━━━⬣`.trim();

        // Send with mentions
        await conn.sendMessage(m.chat, {
            text: message,
            mentions: conn.parseMention(message)
        }, { quoted: m });

    } catch (error) {
        console.error('Leaderboard Error:', error);
        conn.reply(m.chat,
            `❌ Leaderboard failed!\n\nError: ${error.message}\nPlease report this issue.`,
            m
        );
    }
};

// Add debug command
const debugHandler = async (m) => {
    const user = global.db.data.users[m.sender];
    const debugInfo = `
🔍 Registration Debug:
• Registered: ${user?.registered ? '✅' : '❌'}
• Registration Time: ${user?.regTime ? new Date(user.regTime).toLocaleString() : 'Never'}
• EXP: ${user?.exp || 0}
• Diamonds: ${user?.limit || 0}
• Level: ${user?.level || 0}
• Database Key: ${m.sender in global.db.data.users ? 'Exists' : 'Missing'}`;

    await conn.reply(m.chat, debugInfo, m);
};
debugHandler.command = ['debugreg'];
handler.help = ['leaderboard', 'lb [number]'];
handler.tags = ['rpg'];
handler.command = ['leaderboard', 'lb', 'top'];
export default handler;