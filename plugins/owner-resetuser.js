const handler = async (m, { conn, text }) => {
    const numberPattern = /\d+/g;
    let user = '';
    
    // Extract user number from text or quoted message
    const numberMatches = text.match(numberPattern);
    if (numberMatches) {
        const number = numberMatches.join('');
        user = number + '@s.whatsapp.net';
    } else if (m.quoted && await m?.quoted?.sender) {
        const quotedNumberMatches = await m?.quoted?.sender.match(numberPattern);
        if (quotedNumberMatches) {
            const number = quotedNumberMatches.join('');
            user = number + '@s.whatsapp.net';
        } else {
            return conn.sendMessage(m.chat, { text: "Please mention or reply to a user" }, { quoted: m });
        }
    } else {
        return conn.sendMessage(m.chat, { text: "Please provide a user number or mention" }, { quoted: m });
    }

    // Check if user exists in database
    const userNumber = user.split('@')[0];
    if (!global.db.data.users[user] || global.db.data.users[user] == '') {
        return conn.sendMessage(m.chat, { 
            text: `User @${userNumber} is not registered in the database`, 
            mentions: [user] 
        }, { quoted: m });
    }

    // Delete user data
    delete global.db.data.users[user];
    conn.sendMessage(m.chat, { 
        text: `Successfully reset data for user @${userNumber}`, 
        mentions: [user] 
    }, { quoted: m });
};

handler.tags = ['owner'];
handler.command = /(resetdata|deletedata|resetuser)$/i;
handler.rowner = true;
export default handler;