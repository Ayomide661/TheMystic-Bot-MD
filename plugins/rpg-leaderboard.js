const handler = async (m, { conn, args }) => {
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
      exp: parseInt(user.exp) || 0,
      limit: parseInt(user.limit) || 0,
      level: parseInt(user.level) || 0,
      rank: 0
    }));

  // Sorting functions
  const sortBy = (property) => [...users].sort((a, b) => b[property] - a[property]);
  
  const sortedExp = sortBy('exp');
  const sortedLim = sortBy('limit');
  const sortedLevel = sortBy('level');

  // Determine leaderboard length
  const len = args[0] && !isNaN(args[0]) ? 
    Math.min(Math.max(parseInt(args[0]), 10, 100) : 10;

  // Random adventure phrase
  const randomPhrase = translator.texto1[Math.floor(Math.random() * translator.texto1.length)];

  // Generate leaderboard section
  const generateSection = (sortedList, type, unit) => {
    return `
${translator.texto2[1]} ${len} ${translator.texto2[type === 'exp' ? 7 : type === 'limit' ? 8 : 9]}
${translator.texto2[2]} ${sortedList.findIndex(u => u.jid === m.sender) + 1} ${translator.texto2[3]} ${users.length}

${sortedList.slice(0, len).map((user, i) => 
  `□ ${i+1}. @${user.jid.split('@')[0] || 'Unknown'}\n` +
  `□ wa.me/${user.jid.split('@')[0]}\n` +
  `□ *${user[type]} ${unit}*`
).join('\n\n')}`;
  };

  // Compose full message
  const message = `
${translator.texto2[0]}
□ ⚔️ ${randomPhrase} ⚔️

${generateSection(sortedExp, 'exp', translator.texto2[4])}

${generateSection(sortedLim, 'limit', translator.texto2[5])}

${generateSection(sortedLevel, 'level', translator.texto2[6])}
`.trim();

  // Send with mentions
  await conn.sendMessage(m.chat, { 
    text: message, 
    mentions: conn.parseMention(message) 
  }, { quoted: m });
};

handler.help = ['leaderboard'];
handler.tags = ['xp'];
handler.command = ['leaderboard', 'lb'];
export default handler;