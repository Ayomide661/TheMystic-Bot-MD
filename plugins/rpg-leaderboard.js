const handler = async (m, { conn, args }) => {
  try {
    // Get registered users sorted by different metrics
    const users = Object.values(global.db.data.users)
      .filter(user => user.registered && user.jid?.endsWith('@s.whatsapp.net'))
      .map(user => ({
        ...user,
        name: conn.getName(user.jid),
        exp: Math.floor(user.exp || 0),
        limit: Math.floor(user.limit || 0),
        level: Math.floor(user.level || 0)
      }));

    if (!users.length) {
      return conn.reply(m.chat, '🌟 No adventurers have registered yet! Be the first!', m);
    }

    // Sort categories
    const sorted = {
      exp: [...users].sort((a, b) => b.exp - a.exp),
      diamonds: [...users].sort((a, b) => b.limit - a.limit),
      levels: [...users].sort((a, b) => b.level - a.level)
    };

    // Dynamic leaderboard length (5-20)
    const len = Math.min(Math.max(args[0] ? parseInt(args[0]) : 10, 5), 20);

    // Enhanced visual elements
    const createProgressBar = (value, max) => {
      const percentage = max ? Math.min(value / max, 1) : 0;
      const bars = 15;
      const filled = Math.round(percentage * bars);
      const colors = ['🟥', '🟧', '🟨', '🟩', '🟦'];
      const color = colors[Math.min(Math.floor(percentage * colors.length), colors.length - 1)];
      return `${color} ${'█'.repeat(filled)}${'░'.repeat(bars - filled)} ${Math.round(percentage * 100)}%`;
    };

    // Create a leaderboard section
    const createSection = (title, icon, data, key) => {
      const topPlayer = data[0][key] || 1;
      return `
┣━━〘 ${icon} ${title.padEnd(12)}〙━━⬣
${data.slice(0, len).map((user, i) => {
  const rank = `${i + 1}.`.padEnd(3);
  const name = `@${(user.name || user.jid.split('@')[0]).substring(0, 15)}`.padEnd(16);
  const value = `${user[key].toLocaleString()}`.padEnd(8);
  return `┃ ${rank} ${name} ${value}\n┃   ${createProgressBar(user[key], topPlayer)}`;
}).join('\n')}`;
    };

    // Get user's positions
    const getUserRank = (list, jid) => list.findIndex(u => u.jid === jid) + 1 || '--';

    // Compose the full message
    const message = `╭━━〘 🏆 LEADERBOARD 〙━━⬣
┃ 📅 ${new Date().toLocaleDateString()} | 👥 ${users.length} Adventurers
${createSection('EXPERIENCE', '🌟', sorted.exp, 'exp')}
${createSection('DIAMONDS', '💎', sorted.diamonds, 'limit')}
${createSection('LEVELS', '🎚️', sorted.levels, 'level')}
┃
┣━━〘 YOUR RANK 〙━━⬣
┃ • 🌟 EXP: #${getUserRank(sorted.exp, m.sender)}
┃ • 💎 Diamonds: #${getUserRank(sorted.diamonds, m.sender)}
┃ • 🎚️ Level: #${getUserRank(sorted.levels, m.sender)}
┃
╰━━━━━━━━━━━━━━━━━━━━⬣`.trim();

    await conn.sendMessage(m.chat, {
      text: message,
      mentions: conn.parseMention(message)
    }, { quoted: m });

  } catch (error) {
    console.error('Leaderboard error:', error);
    conn.reply(m.chat, '⚠️ An error occurred while generating the leaderboard', m);
  }
};

handler.help = ['leaderboard'];
handler.tags = ['rpg'];
handler.command = ['leaderboard', 'lb', 'top'];
export default handler;