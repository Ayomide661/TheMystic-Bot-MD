import { canLevelUp, xpRange } from '../src/libraries/levelling.js';
import { levelup } from '../src/libraries/canvas.js';

const handler = async (m, { conn }) => {
  const user = global.db.data.users[m.sender];
  
  // Only allow registered users to level up
  if (!user.registered) {
    return conn.reply(m.chat, '🔒 You must register first using *!register* to gain XP', m);
  }

  const name = conn.getName(m.sender);
  const usertag = '@' + m.sender.split('@s.whatsapp.net')[0];
  
  if (!canLevelUp(user.level, user.exp, global.multiplier)) {
    const { min, xp, max } = xpRange(user.level, global.multiplier);
    const message = `
🎯 *XP Progress*
┃
┃• User: ${usertag}
┃• Level: ${user.level}
┃• Role: ${user.role}
┃• XP: ${user.exp - min}/${xp}
┃
┗━━━━━━━━⬣`.trim();
    return conn.sendMessage(m.chat, {text: message, mentions: [m.sender]}, {quoted: m});
  }

  const before = user.level * 1;
  while (canLevelUp(user.level, user.exp, global.multiplier)) user.level++;
  
  if (before !== user.level) {
    try {
      const levelUpImage = await levelup(
        `🎉 ${name} leveled up to ${user.level}!`, 
        user.level
      );
      conn.sendFile(m.chat, levelUpImage, 'levelup.jpg', 
        `╭━━〘 LEVEL UP 〙━━⬣
┃ 
┃ ${name} has advanced!
┃ 
┃ Previous: ${before}
┃ New: ${user.level}
┃ Role: ${user.role}
┃
┗━━━━━━━━⬣`, 
      m);
    } catch (e) {
      conn.reply(m.chat, `🎉 ${name} leveled up to ${user.level}!`, m);
    }
  }
};

handler.help = ['levelup'];
handler.tags = ['xp'];
handler.command = ['nivel', 'lvl', 'levelup', 'level'];
export default handler;