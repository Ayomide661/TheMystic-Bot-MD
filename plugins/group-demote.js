const handler = async (m, {conn, usedPrefix, text}) => {
  const datas = global;
  const language = datas.db.data.users[m.sender].language || global.defaultLanguage;
  const _translate = JSON.parse(fs.readFileSync(`./src/languages/${language}.json`));
  const translator = _translate.plugins.gc_demote;

  // Parse target user
  let number = '';
  if (isNaN(text) && !text.includes('@')) {
    // No valid number found
  } else if (isNaN(text)) {
    number = text.split('@')[1];
  } else if (!isNaN(text)) {
    number = text;
  }

  // Validate input
  if (!text && !m.quoted) {
    return conn.reply(m.chat, 
      `${translator.texto1[0]} ${usedPrefix}demote @tag\n` +
      `┠≽ ${usedPrefix}demote ${translator.texto1[1]}`,
      m
    );
  }
  
  if (number.length > 13 || (number.length < 11 && number.length > 0)) {
    return conn.reply(m.chat, translator.texto2, m);
  }

  try {
    let user;
    if (text) {
      user = `${number}@s.whatsapp.net`;
    } else if (m?.quoted?.sender) {
      user = m.quoted.sender;
    } else if (m.mentionedJid) {
      user = `${number}@s.whatsapp.net`;
    }

    if (!user) throw new Error('No valid user specified');

    // Perform demotion
    await conn.groupParticipantsUpdate(m.chat, [user], 'demote');
    await conn.reply(m.chat, translator.texto3, m);
    
  } catch (error) {
    console.error('Demote error:', error);
    await conn.reply(m.chat, translator.texto4 || 'Failed to demote user', m);
  }
};

handler.help = ['demote @user'];
handler.tags = ['group'];
handler.command = /^(demote|removeadmin|revoke)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;
export default handler;