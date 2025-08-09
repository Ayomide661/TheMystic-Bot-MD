import fs from 'fs';

const handler = async (m, { conn, args, usedPrefix, command }) => {
    // Load language
    const idioma = global.db.data.users[m.sender]?.language || 'en';
    const _translate = JSON.parse(fs.readFileSync(`./src/languages/${idioma}.json`));
    const txt = _translate.plugins.game_crash || {
        start: "🚀 *CRASH GAME STARTED!* Bet: %bet XP\n\nCash out before it crashes!\nType *!cashout* to stop",
        crashed: "💥 *BOOM!* Crashed at %multiplierx\nYou lost %bet XP",
        min_bet: "Minimum bet is 100 XP",
        no_xp: "You don't have enough XP!"
    };

    const bet = parseInt(args[0]);
    const user = global.db.data.users[m.sender];
    
    // Validation
    if (!bet || isNaN(bet)) return m.reply(`Usage: ${usedPrefix}crash <bet>\n${txt.min_bet}`);
    if (bet < 100) return m.reply(txt.min_bet);
    if (user.exp < bet) return m.reply(txt.no_xp);

    // Initialize game if not exists
    if (!global.crashGame) global.crashGame = {};
    
    // Check existing game
    if (global.crashGame[m.chat]) {
        return m.reply("⚠️ A crash game is already running in this chat!");
    }

    // Start new game
    global.crashGame[m.chat] = {
        player: m.sender,
        bet: bet,
        startTime: Date.now(),
        multiplier: 1.0,
        crashed: false
    };

    user.exp -= bet; // Deduct bet immediately

    // Send initial message
    const startMsg = await conn.reply(m.chat, 
        txt.start.replace('%bet', bet), 
        m
    );

    // Store message ID for updates
    global.crashGame[m.chat].msgId = startMsg.key.id;

    // Game simulation
    const crashPoint = (Math.random() * 5 + 1).toFixed(2); // Random crash between 1x-6x
    
    const updateGame = async () => {
        if (!global.crashGame[m.chat]) return;
        
        const game = global.crashGame[m.chat];
        const elapsed = (Date.now() - game.startTime) / 1000;
        game.multiplier = (1 + (elapsed * 0.1)).toFixed(2);

        // Check for natural crash
        if (game.multiplier >= crashPoint) {
            game.crashed = true;
            endGame(m.chat);
            return;
        }

        // Update message
        try {
            await conn.relayMessage(m.chat, {
                protocolMessage: {
                    key: { id: game.msgId, remoteJid: m.chat, fromMe: true },
                    type: 14,
                    editedMessage: {
                        conversation: `🚀 CRASH: ${game.multiplier}x\n\n${txt.start.replace('%bet', bet)}`
                    }
                }
            }, {});
        } catch (e) {
            console.error('Update error:', e);
        }

        // Continue if not crashed
        if (!game.crashed) {
            setTimeout(updateGame, 1000);
        }
    };

    // Start the game loop
    setTimeout(updateGame, 1000);

    // Auto-end after 30 seconds
    setTimeout(() => {
        if (global.crashGame[m.chat] && !global.crashGame[m.chat].crashed) {
            global.crashGame[m.chat].crashed = true;
            endGame(m.chat);
        }
    }, 30000);
};

handler.help = ['crash <bet>'];
handler.tags = ['game'];
handler.command = ['crash'];
export default handler;

// End game function
async function endGame(chatId) {
    if (!global.crashGame[chatId]) return;
    
    const game = global.crashGame[chatId];
    const conn = global.conn;
    const txt = {
        crashed: "💥 *BOOM!* Crashed at %multiplierx\nYou lost %bet XP",
        cashed: "💰 *CASH OUT!* %multiplierx\nYou won %win XP!"
    };

    try {
        if (game.cashedOut) {
            const win = Math.floor(game.bet * game.multiplier);
            global.db.data.users[game.player].exp += win;
            await conn.reply(chatId, 
                txt.cashed
                    .replace('%multiplier', game.multiplier)
                    .replace('%win', win), 
                { quoted: { key: { id: game.msgId }, message: {} } }
            );
        } else {
            await conn.reply(chatId, 
                txt.crashed
                    .replace('%multiplier', game.multiplier)
                    .replace('%bet', game.bet), 
                { quoted: { key: { id: game.msgId }, message: {} } }
            );
        }
    } catch (e) {
        console.error('End game error:', e);
    } finally {
        delete global.crashGame[chatId];
    }
}