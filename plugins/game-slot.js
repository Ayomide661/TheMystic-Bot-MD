import fs from 'fs';

const handler = async (m, { args, usedPrefix, command, conn }) => {
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
    const cooldown = 10000;
    const lastSpin = user.lastslot || 0;
    const remainingTime = cooldown - (Date.now() - lastSpin);

    if (remainingTime > 0) {
        const remainingSec = Math.ceil(remainingTime / 1000);
        throw `${txt.text3[0]} *${remainingSec} seconds* ${txt.text3[1]}`;
    }

    // Define emojis
    const emojis = ['🍒', '🍋', '🍊', '🍇', '🔔', '💎', '7️⃣', '⚡', '👑', '🩸', '🫆'];

    // Function to generate random slot lines
    const generateSlots = () => {
        return [
            [
                emojis[Math.floor(Math.random() * emojis.length)],
                emojis[Math.floor(Math.random() * emojis.length)],
                emojis[Math.floor(Math.random() * emojis.length)]
            ],
            [
                emojis[Math.floor(Math.random() * emojis.length)],
                emojis[Math.floor(Math.random() * emojis.length)],
                emojis[Math.floor(Math.random() * emojis.length)]
            ],
            [
                emojis[Math.floor(Math.random() * emojis.length)],
                emojis[Math.floor(Math.random() * emojis.length)],
                emojis[Math.floor(Math.random() * emojis.length)]
            ]
        ];
    };

    // Send initial message
    const initialText = `🎰 *SLOTS* | Bet: *${bet} XP*\n───────────\n🌀 | 🌀 | 🌀\n🌀 | 🌀 | 🌀\n🌀 | 🌀 | 🌀\n───────────\n*SPINNING...*`;
    let slotsMsg = await conn.sendMessage(m.chat, { text: initialText }, { quoted: m });

    // Spinning animation
    for (let i = 0; i < 5; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const tempSlots = generateSlots();
        const spinningText = `🎰 *SLOTS* | Bet: *${bet} XP*\n───────────\n${tempSlots[0].join(' | ')}\n${tempSlots[1].join(' | ')}\n${tempSlots[2].join(' | ')}\n───────────\n*SPINNING...*`;
        
        try {
            await conn.sendMessage(m.chat, { 
                text: spinningText,
                edit: slotsMsg.key
            });
        } catch (editError) {
            // If editing fails, send as new message
            slotsMsg = await conn.sendMessage(m.chat, { text: spinningText }, { quoted: m });
        }
    }

    // Generate final slots
    const finalSlots = generateSlots();

    // Check for wins
    let winAmount = 0;
    let result = txt.text8;

    // Check each horizontal line
    for (let i = 0; i < 3; i++) {
        if (finalSlots[i][0] === finalSlots[i][1] && finalSlots[i][1] === finalSlots[i][2]) {
            winAmount += bet * 5;
            result = `${txt.text6} *+${bet * 5} XP* 🏆`;
        } else if (finalSlots[i][0] === finalSlots[i][1] || finalSlots[i][0] === finalSlots[i][2] || finalSlots[i][1] === finalSlots[i][2]) {
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

    // Send final result
    const finalText = `🎰 *SLOTS* | Bet: *${bet} XP*\n───────────\n${finalSlots[0].join(' | ')}\n${finalSlots[1].join(' | ')}\n${finalSlots[2].join(' | ')}\n───────────\n${result}\n${winAmount > 0 ? `*TOTAL WIN: +${winAmount} XP*` : ''}`;
    
    try {
        await conn.sendMessage(m.chat, {
            text: finalText,
            edit: slotsMsg.key
        });
    } catch (finalError) {
        // If final edit fails, send as new message
        await conn.sendMessage(m.chat, { text: finalText }, { quoted: m });
    }
};

handler.help = ['slot <bet>'];
handler.tags = ['game'];
handler.command = ['slot', 'slots'];
export default handler;