const handler = async (m, { conn, args }) => {
    try {
        // Get registered users
        const users = Object.entries(global.db.data.users)
            .filter(([jid, user]) => jid.endsWith('@s.whatsapp.net') && user.registered)
            .map(([jid, user]) => ({
                jid,
                name: conn.getName(jid) || 'Unknown user',
                exp: Math.floor(Number(user.exp)) || 0,
                limit: Math.floor(Number(user.limit)) || 0,
                level: Math.floor(Number(user.level)) || 0
            }));

        if (users.length === 0) {
            return conn.reply(m.chat, '🌟 No registered adventurers found!', m);
        }

        // Sorting
        const sortedExp = [...users].sort((a, b) => b.exp - a.exp);
        const sortedLim = [...users].sort((a, b) => b.limit - a.limit);
        const sortedLevel = [...users].sort((a, b) => b.level - a.level);

        // Leaderboard length (5-20)
        const len = Math.min(Math.max(args[0] ? parseInt(args[0]) : 10, 5), 20);

        // Progress bar generator (20 chars)
        const createProgressBar = (value, max) => {
            const pct = max ? Math.min(value / max, 1) : 0;
            const filled = Math.round(pct * 20);
            return `[${'█'.repeat(filled)}${'░'.repeat(20 - filled)}] ${Math.round(pct * 100)}%`;
        };

        // Section generator (EXACTLY matches your format)
        const createSection = (title, icon, list, type) => `
┣━━━〘 ${icon} ${title} 〙━━━⬣
${list.slice(0, len).map((user, i) => {
    const value = user[type].toLocaleString(); // Adds commas
    return `┃ ${(i + 1 + '.').padEnd(3)} @⁨${user.name}⁩   ${value.padEnd(6)} ${type.toUpperCase()}
┃   ${createProgressBar(user[type], list[0][type])}`;
}).join('\n')}`;

        // Build the EXACT message structure you want
        const message = `╭━━━〘 ${'LEADERBOARD'.padEnd(15)}〙━━━⬣
┃
┃ 🏆 *Outstanding Adventurers*
┃ 📅 ${new Date().toLocaleDateString()}
┃ 👥 Total Users: ${users.length}
${createSection('TOP EXPERIENCE', '🌟', sortedExp, 'exp')}
${createSection('TOP DIAMONDS', '💎', sortedLim, 'limit')}
${createSection('TOP LEVELS', '🎚️', sortedLevel, 'level')}
┃
┣━〘 YOUR POSITION 〙━⬣
┃ • EXP: #${sortedExp.findIndex(u => u.jid === m.sender) + 1}
┃ • DIAMONDS: #${sortedLim.findIndex(u => u.jid === m.sender) + 1}
┃ • LEVEL: #${sortedLevel.findIndex(u => u.jid === m.sender) + 1}
┃
╰━━━━━━━━━━━━━━━━━━━━⬣`.trim();

        await conn.sendMessage(m.chat, { 
            text: message, 
            mentions: conn.parseMention(message) 
        }, { quoted: m });

    } catch (error) {
        console.error('Leaderboard Error:', error);
        conn.reply(m.chat, '⚠️ Leaderboard unavailable. Try again later.', m);
    }
};

handler.help = ['leaderboard'];
handler.tags = ['rpg'];
handler.command = ['leaderboard', 'lb'];
export default handler;