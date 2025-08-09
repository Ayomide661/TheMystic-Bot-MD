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

    // Calculate how many levels can be gained
    let levelsToGain = 0;
    let tempLevel = user.level;
    let remainingXP = user.exp;
    
    while (canLevelUp(tempLevel, remainingXP, global.multiplier)) {
      const { xp } = xpRange(tempLevel, global.multiplier);
      remainingXP -= xp;
      tempLevel++;
      levelsToGain++;
    }

    // If no levels can be gained, show progress
    if (levelsToGain === 0) {
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

    // Apply level ups
    const beforeLevel = user.level;
    user.level += levelsToGain;
    
    // XP deduction (optional - remove if you don't want to deduct XP)
    for (let i = 0; i < levelsToGain; i++) {
      const { xp } = xpRange(beforeLevel + i, global.multiplier);
      user.exp -= xp;
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
        `┃ Levels gained: +${levelsToGain}\n` +
        `┃ XP used: ${user.exp}\n` + // Shows remaining XP
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
        `┃ (+${levelsToGain} levels)\n` +
        `┃ XP used: ${user.exp}\n` +
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

// Progress bar helper
function createProgressBar(percentage) {
  const filled = Math.round(percentage * 10);
  return `[${'█'.repeat(filled)}${'░'.repeat(10 - filled)}] ${Math.round(percentage * 100)}%`;
}

handler.help = ['levelup'];
handler.tags = ['xp'];
handler.command = ['nivel', 'lvl', 'levelup', 'level'];
export default handler;