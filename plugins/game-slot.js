import fs from 'fs';

const handler = async (m, { args, usedPrefix, command }) => {
  // Load user data
  const user = global.db.data.users[m.sender];
  if (!user) throw '❌ User data not found!';

  // Load language (with fallback)
  const lang = user.language || 'en';
  let _translate;
  try {
    _translate = JSON.parse(fs.readFileSync(`./src/languages/${lang}.json`));
  } catch (e) {
    _translate = { 
      plugins: { 
        game_slot: {
          text1: "🎰 *SLOT MACHINE* 🎰",
          text2: "Usage: *slot <bet>*\nExample: " + usedPrefix + command + " 500",
          text3: ["⏳ Wait", "before spinning again!"],
          text4: "❗ Minimum bet: *100 XP*",
          text5: "❌ Not enough XP!",
          text6: "🎉 *JACKPOT!* You won",
          text7: "🔸 *Nice!* You won",
          text8: "💢 You lost",
        }
      }
    };
  }
  const txt = _translate.plugins.game_slot;

  // Check bet validity
  if (!args[0]) throw `${txt.text1}\n\n${txt.text2}`;
  const bet = parseInt(args[0]);
  if (isNaN(bet)) throw txt.text2;
  if (bet < 100) throw txt.text4;
  if (user.exp < bet) throw txt.text5;

  // Cooldown check (10 seconds)
  const cooldown = 10000; // 10 seconds
  const lastSpin = user.lastslot || 0;
  const remainingTime = cooldown - (Date.now() - lastSpin);

  if (remainingTime > 0) {
    const remainingSec = Math.ceil(remainingTime / 1000);
    throw `${txt.text3[0]} *${remainingSec} seconds* ${txt.text3[1]}`;
  }

  // Define emojis (common + rare)
  const emojis = ['🍒', '🍋', '🍊', '🍇', '🔔', '💎', '7️⃣'];

  // Generate slots
  const slots = [];
  for (let i = 0; i < 3; i++) {
    slots.push(emojis[Math.floor(Math.random() * emojis.length)]);
  }

  // Calculate win/loss
  let result;
  if (slots[0] === slots[1] && slots[1] === slots[2]) {
    // JACKPOT (5x)
    const win = bet * 5;
    user.exp += win;
    result = `${txt.text6} *+${win} XP* 🏆`;
  } else if (slots[0] === slots[1] || slots[0] === slots[2] || slots[1] === slots[2]) {
    // Partial win (1.5x)
    const win = Math.floor(bet * 1.5);
    user.exp += win;
    result = `${txt.text7} *+${win} XP*`;
  } else {
    // Loss
    user.exp -= bet;
    result = `${txt.text8} *-${bet} XP*`;
  }

  // Update last spin time
  user.lastslot = Date.now();

  // Display result
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