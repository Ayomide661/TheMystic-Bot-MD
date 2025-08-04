const handler = async (m, {conn, usedPrefix}) => {
  const datas = global;
  const language = datas.db.data.users[m.sender].language || global.defaultLanguage;
  const _translate = JSON.parse(fs.readFileSync(`./src/languages/${language}.json`));
  const translator = _translate.plugins.maker_blur;

  // Determine target user - quoted, mentioned, or sender
  const who = m.quoted ? m.quoted.sender : 
              m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : 
              m.fromMe ? conn.user.jid : m.sender;

  try {
    // Get profile picture or use default
    const avatar = await conn.profilePictureUrl(who, 'image')
      .catch(() => 'https://telegra.ph/file/24fa902ead26340f3df2c.png');
    
    // Generate blurred image
    const blurredImage = await fetch(`${global.API}/canvas/blur?avatar=${encodeURIComponent(avatar)}`);
    
    // Send result
    await conn.sendFile(
      m.chat, 
      blurredImage, 
      'blurred.png', 
      translator.texto1, 
      m
    );
  } catch (error) {
    console.error('Error generating blur:', error);
    await m.reply(translator.texto2 || 'Failed to process image');
  }
};

handler.help = ['blur'];
handler.tags = ['maker'];
handler.command = /^(blur|blurimage)$/i;
export default handler;