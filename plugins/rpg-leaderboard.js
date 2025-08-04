const handler = async (m, { conn, args, participants }) => {
  const idioma = global.db.data.users[m.sender]?.language || global.defaultLenguaje;
  const _translate = JSON.parse(fs.readFileSync(`./src/languages/${idioma}.json`));
  const tradutor = _translate.plugins.rpg_leaderboard;

  const users = Object.entries(global.db.data.users)
    .filter(([_, user]) => user.registered)
    .map(([key, value]) => ({
      ...value,
      jid: key,
      exp: Number(value.exp) || 0,
      limit: Number(value.limit) || 0,
      level: Number(value.level) || 0
    }))
    .filter(user =>
      user.jid &&
      user.jid.endsWith("@s.whatsapp.net")
    );

  const sortedExp = [...users].sort((a, b) => b.exp - a.exp);
  const sortedLim = [...users].sort((a, b) => b.limit - a.limit);
  const sortedLevel = [...users].sort((a, b) => b.level - a.level);

  const len = Math.min(args[0] && !isNaN(args[0]) ? Math.max(parseInt(args[0]), 10) : 10, 100);

  // Improved header with ASCII art
  const header = `╭━━━〘 ${'LEADERBOARD'.padEnd(15)}〙━━━⬣
┃
┃ 🏆 *Outstanding Adventurers*
┃ 📅 ${new Date().toLocaleDateString()}
┃ 👥 Total Users: ${users.length}
┃`;

  // Enhanced section template
  const createSection = (title, icon, list, valueName, unit) => {
    return `
┣━━━〘 ${icon} ${title} 〙━━━⬣
${list.slice(0, len).map((user, i) => {
  const position = `${i+1}.`.padEnd(3);
  const name = `@${user.jid.split('@')[0].padEnd(15)}`;
  const value = `${user[valueName]} ${unit}`.padEnd(10);
  const progress = createProgressBar(user[valueName]/list[0][valueName]);
  
  return `┃ ${position} ${name} ${value}\n┃   ${progress}`;
}).join('\n')}`;
  };

  // Create progress bar function
  const createProgressBar = (percentage) => {
    const bars = 20;
    const filled = Math.round(percentage * bars);
    return `[${'█'.repeat(filled)}${'░'.repeat(bars - filled)}] ${Math.round(percentage*100)}%`;
  };

  // Build the complete message
  const message = `${header}
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
    mentions: conn.parseMention(message) 
  }, { quoted: m });
};