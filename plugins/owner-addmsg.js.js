const handler = async (m, { command, usedPrefix, text, conn }) => {
  try {
    // Load translations with fallbacks
    const defaultMessages = {
      text1: "🚫 Please reply to a message",
      text2: ["Use", "to see the list"],
      text3: "already exists in the database",
      text4: ["Successfully saved", "Use"]
    };

    let translations = defaultMessages;
    try {
      const language = global.db.data.users[m.sender]?.language || global.defaultLenguaje || 'en';
      const langFile = JSON.parse(fs.readFileSync(`./src/languages/${language}.json`));
      if (langFile?.plugins?.owner_addmsg) {
        translations = { ...defaultMessages, ...langFile.plugins.owner_addmsg };
      }
    } catch (e) {
      console.error('Translation error:', e);
    }

    // Command processing
    const which = command.replace(/agregar/i, '');
    console.log(`Processing command: agregar${which}`); // Debug log

    if (!m.quoted) {
      console.log('No quoted message'); // Debug log
      return conn.reply(m.chat, translations.text1, m);
    }

    if (!text) {
      console.log('No text provided'); // Debug log
      return conn.reply(m.chat, `${translations.text2[0]} *${usedPrefix}list${which}* ${translations.text2[1]}`, m);
    }

    const msgs = global.db.data.msgs || {};
    console.log(`Checking for existing key: ${text}`); // Debug log

    if (text in msgs) {
      console.log('Key already exists'); // Debug log
      return conn.reply(m.chat, `*[❗] '${text}' ${translations.text3}*`, m);
    }

    // Save the message
    try {
      const quotedMsg = await m.getQuotedObj();
      msgs[text] = m.constructor.toObject(quotedMsg);
      
      // Ensure the database is properly updated
      global.db.data.msgs = msgs;
      await global.db.write(); // Make sure to save to disk
      
      console.log(`Message saved with key: ${text}`); // Debug log
      return conn.reply(m.chat, 
        `✅ ${translations.text4[0]} '${text}'\n${translations.text4[1]} *${usedPrefix}ver${which} ${text}*`, 
        m
      );
    } catch (saveError) {
      console.error('Save error:', saveError);
      return conn.reply(m.chat, '❌ Failed to save message', m);
    }

  } catch (error) {
    console.error('Handler error:', error);
    return conn.reply(m.chat, '⚠️ An error occurred while processing your command', m);
  }
};

// Command metadata
handler.help = ['vn', 'msg', 'video', 'audio', 'img', 'sticker'].map(v => `add${v} <text>`);
handler.tags = ['database'];
handler.command = /^agregar(vn|msg|video|audio|img|sticker)$/i;
handler.rowner = true;

export default handler;