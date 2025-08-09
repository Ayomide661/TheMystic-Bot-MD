const handler = async (m, { conn, args }) => {
  try {
    const idioma = global.db.data.users[m.sender]?.language || global.defaultLenguaje;
    const _translate = JSON.parse(fs.readFileSync(`./src/languages/${idioma}.json`));
    const tradutor = _translate.plugins.rpg_leaderboard;

    // Get registered users
    const users = await Promise.all(
      Object.entries(global.db.data.users)
        .filter(([_, user]) => user.registered)
        .map(async ([jid, user]) => {
          const name = await conn.getName(jid).catch(() => 'Unknown user');
          return {
            jid,
            name,
            exp: Number(user.exp) || 0,
            limit: Number(user.limit) || 0,
            level: Number(user.level) || 0
          };
        })
    ).then(results => results.filter(user => user.jid.endsWith("@s.whatsapp.net")));

    if (users.length === 0) {
      return conn.reply(m.chat, tradutor.no_users || 'No registered users found for leaderboard', m);
    }

    // Sort users
    const sortedExp = [...users].sort((a, b) => b.exp - a.exp);
    const sortedLim = [...users].sort((a, b) => b.limit - a.limit);
    const sortedLevel = [...users].sort((a, b) => b.level - a.level);

    // Leaderboard length (default: 10, max: 100)
    const len = Math.min(
      args[0] && !isNaN(args[0]) ? Math.max(parseInt(args[0]), 10) : 10, 
      100
    );

    // Progress bar
    const createProgressBar = (percentage) => {
      const bars = 20;
      const filled = Math.round(percentage * bars);
      return `[${'█'.repeat(filled)}${'░'.repeat(bars - filled)}] ${Math.round(percentage*100)}%`;
    };

    // Leaderboard section
    const createSection = (title, icon, list, valueName, unit) => {
      if (list.length === 0) return '';
      const maxValue = Math.max(list[0][valueName] || 1, 1); // Ensure not zero
      return `
┣━━━〘 ${icon} ${title} 〙━━━⬣
${list.slice(0, len).map((user, i) => {
  const position = `${i+1}.`.padEnd(3);
  const name = `${user.name}`.slice(0, 15).padEnd(15); // Use stored name
  const value = `${user[valueName].toLocaleString()} ${unit}`.padEnd(10);
  const progress = createProgressBar(user[valueName] / maxValue);
  return `┃ ${position} ${name} ${value}\n┃   ${progress}`;
}).join('\n')}`;
    };

    // Build message
    const message = `╭━━━〘 ${'LEADERBOARD'.padEnd(15)}〙━━━⬣
┃
┃ 🏆 *Outstanding Adventurers*
┃ 📅 ${new Date().toLocaleDateString()}
┃ 👥 Total Users: ${users.length}
${createSection('TOP EXPERIENCE', '🌟', sortedExp, 'exp', 'EXP')}
${createSection('TOP DIAMONDS', '💎', sortedLim, 'limit', 'DIAMONDS')}
${createSection('TOP LEVELS', '🎚️', sortedLevel, 'level', 'LEVEL')}
┃
┣━〘 YOUR POSITION 〙━⬣
┃ • EXP: #${sortedExp.findIndex(u => u.jid === m.sender) + 1}
┃ • DIAMONDS: #${sortedLim.findIndex(u => u.jid === m.sender) + 1}
┃ • LEVEL: #${sortedLevel.findIndex(u => u.jid === m.sender) + 1}
┃
╰━━━━━━━━━━━━━━━━━━━━⬣`.trim();

    await conn.sendMessage(m.chat, { 
      text: message, 
      mentions: users.map(u => u.jid) // Mention all users in the leaderboard
    }, { quoted: m });

  } catch (error) {
    console.error('Leaderboard error:', error);
    conn.reply(m.chat, tradutor.error || 'An error occurred while generating the leaderboard', m);
  }
};

handler.help = ['leaderboard'];
handler.tags = ['xp'];
handler.command = ['leaderboard', 'lb'];
export default handler;