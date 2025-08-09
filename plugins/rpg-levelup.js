import { canLevelUp, xpRange } from '../src/libraries/levelling.js';
import { levelup } from '../src/libraries/canvas.js';

const handler = async (m, { conn }) => {
  try {
    const user = global.db.data.users[m.sender];
    
    // Check registration
    if (!user?.registered) {
      return conn.reply(m.chat, '🔒 You must register first using *!register* to gain XP', m);
    }

    const name = conn.getName(m.sender) || 'Player';
    const usertag = '@' + m.sender.split('@')[0];
    const currentLevel = user.level || 1;

    // Check if can level up
    if (!canLevelUp(currentLevel, user.exp, global.multiplier)) {
      const { min, xp } = xpRange(currentLevel, global.multiplier);
      const progress = user.exp - min;
      const progressBar = createProgressBar(progress / xp);
      
      return conn.reply(m.chat, 
        `🎯 *XP Progress*\n` +
        `┃\n` +
        `┃ • User: ${usertag}\n` +
        `┃ • Level: ${currentLevel}\n` +
        `┃ • XP: ${progress}/${xp}\n` +
        `┃ • Progress: ${progressBar}\n` +
        `┗━━━━━━━━⬣`,
        m
      );
    }

    // Level up process
    const beforeLevel = currentLevel;
    let levelsGained = 0;
    
    while (canLevelUp(user.level, user.exp, global.multiplier)) {
      user.level++;
      levelsGained++;
    }

    // Send level up notification
    try {
      const levelUpImage = await levelup(
        `${name} leveled up!`,
        beforeLevel,
        user.level
      );
      
      await conn.sendFile(
        m.chat,
        levelUpImage,
        'levelup.jpg',
        `╭━━〘 LEVEL UP 〙━━⬣\n` +
        `┃\n` +
        `┃ 🎉 ${name}\n` +
        `┃\n` +
        `┃ Previous: ${beforeLevel}\n` +
        `┃ New: ${user.level}\n` +
        `┃ Levels gained: +${levelsGained}\n` +
        `┃ Role: ${user.role || 'No role'}\n` +
        `┃\n` +
        `┗━━━━━━━━⬣`,
        m
      );
    } catch (e) {
      console.error('Levelup image error:', e);
      await conn.reply(m.chat,
        `╭━━〘 LEVEL UP 〙━━⬣\n` +
        `┃\n` +
        `┃ 🎉 ${name}\n` +
        `┃\n` +
        `┃ Leveled up to ${user.level}!\n` +
        `┃ (+${levelsGained} levels)\n` +
        `┃\n` +
        `┗━━━━━━━━⬣`,
        m
      );
    }
  } catch (error) {
    console.error('Levelup handler error:', error);
    conn.reply(m.chat, '⚠️ An error occurred during level up', m);
  }
};

// Helper function for progress bar
function createProgressBar(percentage) {
  const filled = '█'.repeat(Math.round(percentage * 10));
  const empty = '░'.repeat(10 - filled.length);
  return `[${filled}${empty}] ${Math.round(percentage * 100)}%`;
}

handler.help = ['levelup'];
handler.tags = ['xp'];
handler.command = ['nivel', 'lvl', 'levelup', 'level'];
export default handler;