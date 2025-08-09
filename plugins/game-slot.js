import fs from 'fs';
import { delay } from '../lib/utils.js'; // Optional: For animation effect

const handler = async (m, { args, usedPrefix, command }) => {
  // Load user data and language
  const user = global.db.data.users[m.sender];
  if (!user) throw '❌ User data not found!';
  const lang = user.language || global.defaultLenguaje || 'en';
  
  // Load translations (with fallback)
  let _translate;
  try {
    _translate = JSON.parse(fs.readFileSync(`./src/languages/${lang}.json`));
  } catch (e) {
    _translate = { 
      plugins: { 
        game_slot: {
          text1: "🎰 *SLOT MACHINE* 🎰",
          text2: "Usage: *slot <bet amount>*",
          text3: ["⏳ Wait", "before spinning again!"],
          text4: "❗ Minimum bet: *100 XP*",
          text5: "❌ You don't have enough XP!",
          text6: "🎉 *JACKPOT!* You won",
          text7: "🔸 *Nice!* You won",
          text8: "💢 You lost",
        }
      }
    };
  }
  const txt = _translate.plugins.game_slot;

  // Check bet validity
  if (!args[0]) throw `${txt.text1}\n\n${txt.text2}\n*Example:*\n${usedPrefix + command} 500`;
  if (isNaN(args[0])) throw txt.text2;
  const bet = parseInt(args[0]);
  if (bet < 100) throw txt.text4;
  if (user.exp < bet) throw txt.text5;

  // Anti-spam cooldown (10 seconds)
  const cooldown = 10000;
  const lastSpin = user.lastslot || 0;
  if (Date.now() - lastSpin < cooldown) {
    const remaining = msToTime(cooldown - (Date.now() - lastSpin));
    throw `${txt.text3[0]} ${remaining} ${txt.text3[1]}`;
  }

  // Define emojis (some are rarer for bigger wins)
  const emojis = [
    '🍒', '🍋', '🍊', '🍇', // Common (lower payout)
    '🔔', '💎', '7️⃣',       // Rare (higher payout)
  ];

  // Generate slot results
  const slots = [];
  for (let i = 0; i < 3; i++) {
    slots.push(emojis[Math.floor(Math.random() * emojis.length)]);
  }

  // Optional: Add spinning animation (uncomment if you want it)
  
  const spinMsg = await m.reply('🎰 Spinning...');
  await delay(1500); // 1.5-second delay
  await spinMsg.delete();
 

  // Calculate win/loss
  let result;
  if (slots[0] === slots[1] && slots[1] === slots[2]) {
    // JACKPOT (all 3 match)
    const win = bet * 5; // 5x payout
    user.exp += win;
    result = `${txt.text6} *+${win} XP* 🏆`;
  } else if (slots[0] === slots[1] || slots[0] === slots[2] || slots[1] === slots[2]) {
    // Partial win (2 match)
    const win = Math.floor(bet * 1.5); // 1.5x payout
    user.exp += win;
    result = `${txt.text7} *+${win} XP*`;
  } else {
    // Loss
    user.exp -= bet;
    result = `${txt.text8} *-${bet} XP*`;
  }

  // Update last spin time
  user.lastslot = Date.now();

  // Display slot results
  await m.reply(`
🎰 *SLOTS* | Bet: *${bet} XP*
───────────
${slots.join(' | ')}
───────────
${result}
  `);
};

handler.help = ['slot <bet>'];
handler.tags = ['game'];
handler.command = ['slot', 'slots'];
export default handler;

function msToTime(ms) {
  const sec = Math.floor(ms / 1000);
  return `${sec} seconds`;
}