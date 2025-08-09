import fs from 'fs';

const handler = async (m, { conn, args }) => {
  try {
    // Load language data
    const idioma = global.db.data.users[m.sender]?.language || global.defaultLenguaje;
    let _translate;
    try {
      _translate = JSON.parse(fs.readFileSync(`./src/languages/${idioma}.json`));
    } catch (e) {
      _translate = {
        plugins: {
          rpg_leaderboard: {
            no_users: "No registered users found for leaderboard",
            error: "An error occurred while generating the leaderboard"
          }
        }
      };
    }
    const tradutor = _translate.plugins.rpg_leaderboard;

    // Get registered users with proper name handling
    const users = await Promise.all(
      Object.entries(global.db.data.users)
        .filter(([_, user]) => user.registered)
        .map(async ([jid, user]) => {
          try {
            const name = await conn.getName(jid) || 'Unknown user';
            return {
              jid,
              name,
              exp: Number(user.exp) || 0,
              limit: Number(user.limit) || 0,
              level: Number(user.level) || 0
            };
          } catch (e) {
            return {
              jid,
              name: 'Unknown user',
              exp: 0,
              limit: 0,
              level: 0
            };
          }
        })
    ).then(results => results.filter(user => user.jid.endsWith("@s.whatsapp.net")));

    if (users.length === 0) {
      return conn.reply(m.chat, tradutor.no_users, m);
    }

    // Sort users
    const sortedExp = [...users].sort((a, b) => b.exp - a.exp);
    const sortedLim = [...users].sort((a, b) => b.limit - a.limit);
    const sortedLevel = [...users].sort((a, b) => b.level - a.level);

    // Leaderboard length
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

    // Create leaderboard section
    const createSection = (title, list, valueName, unit) => {
      if (list.length === 0) return '';
      const maxValue = Math.max(list[0][valueName], 1);
      return `
┣━━━〘 ${title} 〙━━━⬣
${list.slice(0, len).map((user, i) => {
  const position = `${i+1}.`.padEnd(3);
  const name = user.name.slice(0, 15).padEnd(15);
  const value = `${user[valueName].toLocaleString()} ${unit}`.padEnd(10);
  const progress = createProgressBar(user[valueName] / maxValue);
  return `┃ ${position} ${name} ${value}\n┃   ${progress}`;
}).join('\n')}`;
    };

    // Build message
    const message = `╭━━━〘 LEADERBOARD 〙━━━⬣
┃
┃ 🏆 *Outstanding Adventurers*
┃ 📅 ${new Date().toLocaleDateString()}
┃ 👥 Total Users: ${users.length}
${createSection('🌟 TOP EXPERIENCE', sortedExp, 'exp', 'EXP')}
${createSection('💎 TOP DIAMONDS', sortedLim, 'limit', 'DIAMONDS')}
${createSection('🎚️ TOP LEVELS', sortedLevel, 'level', 'LEVEL')}
┃
┣━〘 YOUR POSITION 〙━⬣
┃ • EXP: #${sortedExp.findIndex(u => u.jid === m.sender) + 1}
┃ • DIAMONDS: #${sortedLim.findIndex(u => u.jid === m.sender) + 1}
┃ • LEVEL: #${sortedLevel.findIndex(u => u.jid === m.sender) + 1}
┃
╰━━━━━━━━━━━━━━━━━━━━⬣`.trim();

    await conn.sendMessage(m.chat, { 
      text: message,
      mentions: users.map(u => u.jid)
    }, { quoted: m });

  } catch (error) {
    console.error('Leaderboard error:', error);
    conn.reply(m.chat, 'An error occurred while generating the leaderboard', m);
  }
};

handler.help = ['leaderboard'];
handler.tags = ['xp'];
handler.command = ['leaderboard', 'lb'];
export default handler;