import fs from 'fs';

const handler = async (m, { conn, args, usedPrefix, command }) => {
    // Load language
    const idioma = global.db.data.users[m.sender]?.language || 'en';
    const _translate = JSON.parse(fs.readFileSync(`./src/languages/${idioma}.json`));
    const txt = _translate.plugins.game_crash || {
        start: "🚀 *CRASH GAME STARTED!* Bet: %bet XP\n\nCash out before it crashes!\nReply with *!cashout*",
        crashed: "💥 *BOOM!* Crashed at %multiplierx\nYou lost %bet XP",
        cashed: "💰 *CASH OUT!* %multiplierx\nYou won %win XP!",
        min_bet: "Minimum bet is 100 XP",
        no_xp: "You don't have enough XP!"
    };

    // Game variables
    const bet = parseInt(args[0]);
    const user = global.db.data.users[m.sender];
    
    // Validation
    if (!bet || isNaN(bet)) return m.reply(`Usage: ${usedPrefix}crash <bet>\n${txt.min_bet}`);
    if (bet < 100) return m.reply(txt.min_bet);
    if (user.exp < bet) return m.reply(txt.no_xp);

    // Start game
    if (global.crashGame && global.crashGame.active) {
        return m.reply("⚠️ A crash game is already in progress!");
    }

    global.crashGame = {
        active: true,
        player: m.sender,
        bet: bet,
        startTime: Date.now(),
        multiplier: 1.0
    };

    user.exp -= bet; // Deduct bet immediately

    // Send initial message
    const startMsg = await m.reply(txt.start.replace('%bet', bet));

    // Game simulation
    let crashed = false;
    const crashPoint = (Math.random() * 5 + 1).toFixed(2); // Random crash between 1x-6x
    
    const updateInterval = setInterval(async () => {
        if (!global.crashGame.active) {
            clearInterval(updateInterval);
            return;
        }

        const elapsed = (Date.now() - global.crashGame.startTime) / 1000;
        global.crashGame.multiplier = (1 + (elapsed * 0.1)).toFixed(2);

        // Check if crashed naturally
        if (global.crashGame.multiplier >= crashPoint) {
            crashed = true;
            endGame();
        }

        // Update message
        try {
            await conn.relayMessage(m.chat, {
                protocolMessage: {
                    key: startMsg.key,
                    type: 14,
                    editedMessage: {
                        conversation: `🚀 CRASH: ${global.crashGame.multiplier}x\n\n${txt.start.replace('%bet', bet)}`
                    }
                }
            }, {});
        } catch (e) {
            console.error('Update error:', e);
        }
    }, 1000);

    // Cashout handler
    const cashoutHandler = async (msg) => {
        if (msg.sender !== m.sender || !msg.text.toLowerCase().includes('cashout')) return;
        
        clearInterval(updateInterval);
        global.crashGame.active = false;
        
        const win = Math.floor(bet * global.crashGame.multiplier);
        user.exp += win;
        
        await conn.reply(m.chat, 
            txt.cashed
                .replace('%multiplier', global.crashGame.multiplier)
                .replace('%win', win), 
            m
        );
        
        conn.ev.off('messages.upsert', cashoutHandler);
    };

    // Crash handler
    const endGame = async () => {
        clearInterval(updateInterval);
        global.crashGame.active = false;
        
        if (crashed) {
            await conn.reply(m.chat, 
                txt.crashed
                    .replace('%multiplier', global.crashGame.multiplier)
                    .replace('%bet', bet), 
                m
            );
        }
        
        conn.ev.off('messages.upsert', cashoutHandler);
    };

    // Listen for cashout
    conn.ev.on('messages.upsert', cashoutHandler);

    // Auto-end after 30 seconds
    setTimeout(() => {
        if (global.crashGame.active) {
            crashed = true;
            endGame();
        }
    }, 30000);
};

handler.help = ['crash <bet>'];
handler.tags = ['game'];
handler.command = ['crash'];
export default handler;