const handler = async (m, { conn }) => {
    if (!global.crashGame || !global.crashGame[m.chat]) {
        return conn.reply(m.chat, "No active crash game to cash out!", m);
    }

    const game = global.crashGame[m.chat];
    if (game.player !== m.sender) {
        return conn.reply(m.chat, "You're not the player of this game!", m);
    }

    if (game.crashed || game.cashedOut) {
        return conn.reply(m.chat, "This game has already ended!", m);
    }

    // Mark as cashed out
    game.cashedOut = true;
    game.crashed = true; // Force end game
    endGame(m.chat);
};

handler.help = ['cashout'];
handler.tags = ['game'];
handler.command = ['cashout'];
export default handler;