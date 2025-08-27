import TicTacToe from '../src/libraries/tictactoe.js';

const handler = async (m, { conn, usedPrefix, command, text }) => {
    // Game configuration
    const gameConfig = {
        maxGames: 10,
        timeout: 300000, // 5 minutes
        rewards: {
            win: 50,
            draw: 10,
            loss: 0
        }
    };

    // Initialize games object if it doesn't exist
    conn.game = conn.game || {};
    
    // Clean up old games
    const now = Date.now();
    for (const roomId in conn.game) {
        if (conn.game[roomId].createdAt && now - conn.game[roomId].createdAt > gameConfig.timeout) {
            delete conn.game[roomId];
        }
    }

    // Check if user is already in a game
    const userInGame = Object.values(conn.game).find(room => 
        room.id.startsWith('tictactoe') && 
        [room.game.playerX, room.game.playerO].includes(m.sender)
    );
    
    if (userInGame) throw `🚫 *You are already in a game!* Use *${usedPrefix}delttc* to leave your current game.`;

    // Check maximum concurrent games
    const activeGames = Object.values(conn.game).filter(room => room.id.startsWith('tictactoe'));
    if (activeGames.length >= gameConfig.maxGames) {
        throw `🎮 *Game Server Full!*\nMaximum ${gameConfig.maxGames} concurrent games reached. Try again later.`;
    }

    if (!text) throw `🎯 *TIC TAC TOE*\n\n*Usage:* ${usedPrefix + command} *<room-name>*\n*Example:* ${usedPrefix + command} *pro-players*`;

    // Find waiting room
    let room = Object.values(conn.game).find(room => 
        room.state === 'WAITING' && 
        (text ? room.name === text : true)
    );

    if (room) {
        // Join existing room
        await m.reply('✅ *Joining game room...*');
        
        room.o = m.chat;
        room.game.playerO = m.sender;
        room.state = 'PLAYING';
        room.joinedAt = Date.now();

        // Create game board with emojis
        const arr = room.game.render().map(v => ({
            X: '❌',
            O: '🔵',
            1: '1️⃣',
            2: '2️⃣',
            3: '3️⃣',
            4: '4️⃣',
            5: '5️⃣',
            6: '6️⃣',
            7: '7️⃣',
            8: '8️⃣',
            9: '9️⃣',
        }[v]));

        // Get player names without @
        const playerXName = room.game.playerX.split('@')[0];
        const playerOName = room.game.playerO.split('@')[0];
        const currentPlayerName = room.game.currentTurn.split('@')[0];

        const gameInfo = `
🎮 *TIC TAC TOE BATTLE* 🎮

⚡ *Room:* ${room.name}
⏰ *Created:* ${new Date(room.createdAt).toLocaleTimeString()}

❌ *Player X:* ${playerXName}
🔵 *Player O:* ${playerOName}

📊 *Board:*
        ${arr.slice(0, 3).join('')}
        ${arr.slice(3, 6).join('')}
        ${arr.slice(6).join('')}

🎯 *Turn:* ${currentPlayerName}

💡 *How to play:* Reply with number (1-9) to place your mark!
⏰ *Timeout:* 5 minutes
`.trim();

        // Send to both players
        const mentions = [room.game.playerX, room.game.playerO];
        if (room.x !== room.o) {
            await conn.sendMessage(room.x, { 
                text: gameInfo, 
                mentions,
                contextInfo: {
                    mentionedJid: mentions
                }
            }, { quoted: m });
        }
        await conn.sendMessage(room.o, { 
            text: gameInfo, 
            mentions,
            contextInfo: {
                mentionedJid: mentions
            }
        }, { quoted: m });

    } else {
        // Create new room
        room = {
            id: 'tictactoe-' + Date.now(),
            x: m.chat,
            o: '',
            name: text,
            game: new TicTacToe(m.sender, 'o'),
            state: 'WAITING',
            createdAt: Date.now(),
            createdBy: m.sender,
            stats: {
                moves: 0,
                startTime: null,
                endTime: null
            }
        };

        // Get host name without @
        const hostName = conn.getName(m.sender) || m.sender.split('@')[0];

        const roomInfo = `
🎮 *NEW TIC TAC TOE ROOM CREATED* 🎮

⚡ *Room Name:* ${text}
👤 *Host:* ${hostName}
⏰ *Created:* ${new Date().toLocaleTimeString()}

👥 *Waiting for opponent...*
💎 *Rewards:* Win: ${gameConfig.rewards.win} | Draw: ${gameConfig.rewards.draw}

🔗 *Join with:* ${usedPrefix + command} ${text}
❌ *Delete room:* ${usedPrefix}delttc

⏰ *Room expires in 5 minutes*
`.trim();

        // Send room creation message
        await conn.sendMessage(m.chat, {
            text: roomInfo,
            contextInfo: {
                externalAdReply: {
                    title: '🎯 TIC TAC TOE CHALLENGE',
                    body: `Join ${text} room!`,
                    thumbnailUrl: 'https://i.postimg.cc/wT5WgHhr/images.jpg',
                    sourceUrl: 'https://whatsapp.com/channel/0029VbAEvHAA2pLJa8FLK00e',
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: m });

        conn.game[room.id] = room;
        
        // Auto-delete room after timeout
        setTimeout(() => {
            if (conn.game[room.id] && conn.game[room.id].state === 'WAITING') {
                delete conn.game[room.id];
                conn.sendMessage(m.chat, {
                    text: `⏰ *ROOM EXPIRED*\nRoom "${text}" has been deleted due to inactivity.`
                });
            }
        }, gameConfig.timeout);
    }
};

handler.help = ['ttc <room-name>'];
handler.tags = ['game'];
handler.command = /^(ttc)$/i;
handler.group = true;
handler.game = true;
handler.limit = true;

export default handler;