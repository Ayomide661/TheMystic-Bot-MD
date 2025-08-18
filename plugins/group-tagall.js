const handler = async (m, {isOwner, isAdmin, conn, text, participants, args, command, usedPrefix}) => {
  const datas = global;
  const language = datas.db.data.users[m.sender]?.language || global.defaultLanguage || 'en';
  
  try {
    // Load translation file safely
    const _translate = JSON.parse(fs.readFileSync(`./src/languages/${language}.json`));
    const translator = _translate.plugins?.gc_tagall || {
      text1: [
        "Message:",       // [0] Default if not found
        "Attention everyone!",  // [1]
        "Members:"        // [2]
      ]
    };

    if (usedPrefix == 'a' || usedPrefix == 'A') return;
    if (!(isAdmin || isOwner)) {
      global.dfail('admin', m, conn);
      throw false;
    }

    const message = args.join` `;
    const oi = `${translator.text1[0]} ${message}`;
    let text = `${translator.text1[1]} ${oi}\n\n${translator.text1[2]}\n`;
    
    for (const mem of participants) {
      text += `┣➥ @${mem.jid.split('@')[0]}\n`;
    }
    
    text += `*└* 𝐁𝐲 𝐓𝐡𝐞 𝐌𝐲𝐬𝐭𝐢𝐜 - 𝐁𝐨𝐭\n\n*▌│█║▌║▌║║▌║▌║▌║█*`;
    await conn.sendMessage(m.chat, {text: text, mentions: participants.map((a) => a.jid)});
    
  } catch (err) {
    console.error('Error in tagall handler:', err);
    await conn.sendMessage(m.chat, {text: '❌ An error occurred while processing the tagall command.'});
  }
};

handler.help = ['tagall <message>', 'invoke <message>'];
handler.tags = ['group'];
handler.command = /^(tagall|invoke|invocation|all)$/i;
handler.admin = true;
handler.group = true;
export default handler;