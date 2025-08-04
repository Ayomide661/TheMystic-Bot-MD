const handler = async (m, { conn, args }) => {
    try {
        // Get language data
        const language = global.db.data.users[m.sender]?.language || global.defaultLenguaje;
        const _translate = JSON.parse(fs.readFileSync(`./src/languages/${language}.json`));
        const translator = _translate.plugins.rpg_leaderboard;

        // Process user data
        const users = Object.entries(global.db.data.users)
            .filter(([key]) => key.endsWith('@s.whatsapp.net'))
            .map(([jid, user]) => ({
                jid,
                name: conn.getName(jid),
                exp: Number(user.exp) || 0,
                limit: Number(user.limit) || 0,
                level: Number(user.level) || 0
            }));

        // Sorting
        const sortedExp = [...users].sort((a, b) => b.exp - a.exp);
        const sortedLim = [...users].sort((a, b) => b.limit - a.limit);
        const sortedLevel = [...users].sort((a, b) => b.level - a.level);

        // Determine length
        const len = args[0] && !isNaN(args[0]) ? Math.min(Math.max(parseInt(args[0]), 10, 100) : 10;

        // Random phrase
        const randomPhrase = translator.texto1[Math.floor(Math.random() * translator.texto1.length)];

        // Generate leaderboard section
        const getSection = (list, type, unit) => {
            const rankText = translator.texto2;
            return `
${rankText[1]} ${len} ${rankText[type === 'exp' ? 7 : type === 'limit' ? 8 : 9]}
${rankText[2]} ${list.findIndex(u => u.jid === m.sender) + 1} ${rankText[3]} ${users.length}

${list.slice(0, len).map((user, i) => 
    `□ ${i+1}. @${user.jid.split('@')[0]}\n` + 
    `□ wa.me/${user.jid.split('@')[0]}\n` +
    `□ *${user[type]} ${unit}*`
).join('\n\n')}`;
        };

        // Compose message
        const message = `
${translator.texto2[0]}
□ ⚔️ ${randomPhrase} ⚔️

${getSection(sortedExp, 'exp', translator.texto2[4])}

${getSection(sortedLim, 'limit', translator.texto2[5])}

${getSection(sortedLevel, 'level', translator.texto2[6])}`.trim();

        // Send message
        await conn.sendMessage(m.chat, { 
            text: message, 
            mentions: conn.parseMention(message) 
        }, { quoted: m });

    } catch (error) {
        console.error('Leaderboard error:', error);
        await conn.reply(m.chat, '❌ An error occurred while generating the leaderboard. Please try again later.', m);
    }
};

handler.help = ['leaderboard'];
handler.tags = ['xp'];
handler.command = ['leaderboard', 'lb'];
export default handler;