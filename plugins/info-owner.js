const handler = async (m, {conn, usedPrefix}) => {
  const doc = ['pdf', 'zip', 'vnd.openxmlformats-officedocument.presentationml.presentation', 
              'vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
              'vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const document = doc[Math.floor(Math.random() * doc.length)];
  
  const text = `
🔮 *Bot Creator Information* 🔮

🤖 *Bot Name:* TheMystic-Bot-MD  
👨‍💻 *Developer:* Bruno Sobrino  
📝 *Description:* Advanced WhatsApp Bot with rich features  
🌎 *GitHub:* https://github.com/BrunoSobrino/TheMystic-Bot-MD  
📺 *YouTube:* https://www.youtube.com/channel/UCSTDMKjbm-EmEovkygX-lCA  

💡 *Features:*
- Multi-device support
- Advanced AI capabilities
- RPG game elements
- Downloader tools
- Sticker creator
- And much more!

📌 *Note:* This project is open source and constantly updated.

⚙️ *Tech Stack:*
- Node.js
- Baileys
- Various npm libraries

🔧 *Support:* For any issues, please open a ticket on GitHub
`.trim();

  const buttonMessage = {
    'document': {url: `https://github.com/BrunoSobrino/TheMystic-Bot-MD`},
    'mimetype': `application/${document}`,
    'fileName': `Official Bot Documentation`,
    'fileLength': 99999999999999,
    'pageCount': 200,
    'contextInfo': {
      'forwardingScore': 200,
      'isForwarded': true,
      'externalAdReply': {
        'mediaUrl': 'https://github.com/BrunoSobrino/TheMystic-Bot-MD',
        'mediaType': 2,
        'previewType': 'pdf',
        'title': 'TheMystic Bot - Official Documentation',
        'body': global.wm,
        'thumbnail': global.imagen1,
        'sourceUrl': 'https://www.youtube.com/channel/UCSTDMKjbm-EmEovkygX-lCA'
      }
    },
    'caption': text,
    'footer': global.wm,
    'headerType': 6
  };
  
  conn.sendMessage(m.chat, buttonMessage, {quoted: m});
};

handler.help = ['owner'];
handler.tags = ['info'];
handler.command = /^(owner|creator|dev|developer)$/i;

export default handler;