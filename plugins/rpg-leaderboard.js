const handler = async (m, { conn, args }) => {
    try {
        // Get registered users with proper phone number handling
        const users = Object.entries(global.db.data.users)
            .filter(([jid, user]) => jid.endsWith('@s.whatsapp.net') && user.registered)
            .map(([jid, user]) => ({
                jid,
                phone: jid.replace('@s.whatsapp.net', ''),
                name: conn.getName(jid) || 'User',
                exp: Math.floor(Number(user.exp)) || 0,
                limit: Math.floor(Number(user.limit)) || 0,
                level: Math.floor(Number(user.level)) || 0
            }));

        if (users.length === 0) {
            return conn.reply(m.chat, '🌟 No registered adventurers found! Use *!register* to join.', m);
        }

        // Sorting
        const sorted = {
            exp: [...users].sort((a, b) => b.exp - a.exp),
            diamonds: [...users].sort((a, b) => b.limit - a.limit),
            levels: [...users].sort((a, b) => b.level - a.level)
        };

        // Leaderboard length (5-15)
        const len = Math.min(Math.max(args[0] ? parseInt(args[0]) : 10, 5), 15);

        // Progress bar without colors
        const createProgressBar = (value, max) => {
            const pct = max ? Math.min(value / max, 1) : 0;
            return `[${'█'.repeat(Math.round(pct * 10))}${'░'.repeat(10 - Math.round(pct * 10))}] ${Math.round(pct * 100)}%`;
        };

        // Clean section generator
        const createSection = (title, icon, data, key) => `
┣━━〘 ${icon} ${title.padEnd(10)}〙━━⬣
${data.slice(0, len).map((user, i) => 
    `┃ ${(i + 1 + '.').padEnd(3)} ${user.name.padEnd(12)} (${user.phone})
┃   ${user[key].toLocaleString().padEnd(8)} ${createProgressBar(user[key], data[0][key])}`
).join('\n')}`;

        // Final message composition
        const message = `╭━━〘 🏆 LEADERBOARD 〙━━⬣
┃ 📅 ${new Date().toLocaleDateString()} | 👥 ${users.length} Adventurers
${createSection('EXPERIENCE', '🌟', sorted.exp, 'exp')}
${createSection('DIAMONDS', '💎', sorted.diamonds, 'limit')}
${createSection('LEVELS', '🎚️', sorted.levels, 'level')}
┃
┣━━〘 YOUR RANK 〙━━⬣
┃ • EXP: #${sorted.exp.findIndex(u => u.jid === m.sender) + 1}
┃ • Diamonds: #${sorted.diamonds.findIndex(u => u.jid === m.sender) + 1}
┃ • Level: #${sorted.levels.findIndex(u => u.jid === m.sender) + 1}
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

handler.help = ['leaderboard [number]'];
handler.tags = ['rpg'];
handler.command = ['leaderboard', 'lb', 'top'];
export default handler;