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
  const emojis = ['🍒', '🍋', '🍊', '🍇', '🔔', '💎', '7️⃣', '⚡', '👑', '🩸', '🫆'];

  // Generate initial spinning message
  let spinningMsg = await m.reply(`
🎰 *SLOTS* | Bet: *${bet} XP*
───────────
🌀 | 🌀 | 🌀
🌀 | 🌀 | 🌀
🌀 | 🌀 | 🌀
───────────
*SPINNING...*`);

  // Function to generate random emoji
  const getRandomEmoji = () => emojis[Math.floor(Math.random() * emojis.length)];

  // Spinning animation
  for (let i = 0; i < 5; i++) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const tempSlots = [
      [getRandomEmoji(), getRandomEmoji(), getRandomEmoji()],
      [getRandomEmoji(), getRandomEmoji(), getRandomEmoji()],
      [getRandomEmoji(), getRandomEmoji(), getRandomEmoji()]
    ];
    await spinningMsg.edit(`
🎰 *SLOTS* | Bet: *${bet} XP*
───────────
${tempSlots[0].join(' | ')}
${tempSlots[1].join(' | ')}
${tempSlots[2].join(' | ')}
───────────
*SPINNING...*`);
  }

  // Generate final slots
  const slots = [
    [getRandomEmoji(), getRandomEmoji(), getRandomEmoji()],
    [getRandomEmoji(), getRandomEmoji(), getRandomEmoji()],
    [getRandomEmoji(), getRandomEmoji(), getRandomEmoji()]
  ];

  // Check for wins (horizontal lines only)
  let winAmount = 0;
  let result = txt.text8; // Default loss message

  // Check each horizontal line
  for (let i = 0; i < 3; i++) {
    if (slots[i][0] === slots[i][1] && slots[i][1] === slots[i][2]) {
      // JACKPOT (5x)
      winAmount += bet * 5;
      result = `${txt.text6} *+${bet * 5} XP* 🏆`;
    } else if (slots[i][0] === slots[i][1] || slots[i][0] === slots[i][2] || slots[i][1] === slots[i][2]) {
      // Partial win (1.5x)
      winAmount += Math.floor(bet * 1.5);
      result = `${txt.text7} *+${Math.floor(bet * 1.5)} XP*`;
    }
  }

  // Update user XP
  if (winAmount > 0) {
    user.exp += winAmount;
  } else {
    user.exp -= bet;
    result = `${txt.text8} *-${bet} XP*`;
  }

  // Update last spin time
  user.lastslot = Date.now();

  // Display final result
  await spinningMsg.edit(`
🎰 *SLOTS* | Bet: *${bet} XP*
───────────
${slots[0].join(' | ')}
${slots[1].join(' | ')}
${slots[2].join(' | ')}
───────────
${result}
${winAmount > 0 ? `*TOTAL WIN: +${winAmount} XP*` : ''}`);
};

handler.help = ['slot <bet>'];
handler.tags = ['game'];
handler.command = ['slot', 'slots'];
export default handler;