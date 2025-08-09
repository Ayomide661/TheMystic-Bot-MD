import { createHash } from 'crypto';

const handler = async function(m, { conn, text, usedPrefix }) {
  // Default fallback message
  const defaultMessage = "📌 Your serial number is:";
  
  try {
    // Try to load translations safely
    let displayMessage = defaultMessage;
    try {
      const datas = global;
      const language = datas.db.data.users[m.sender]?.language || global.defaultLenguaje || 'en';
      const translations = JSON.parse(fs.readFileSync(`./src/languages/${language}.json`));
      if (translations?.plugins?.rpg_myns?.text1) {
        displayMessage = translations.plugins.rpg_myns.text1;
      }
    } catch (e) {
      console.error('Translation load error:', e);
    }

    // Generate serial number
    const sn = createHash('md5').update(m.sender).digest('hex');
    
    // Send formatted response
    await conn.reply(m.chat, 
      `┏┅ ━━━━━━━━━━━━ ┅ ━
┃ ${displayMessage} 
┃ ${sn}
┗┅ ━━━━━━━━━━━━ ┅ ━`.trim(), 
      m
    );
    
  } catch (error) {
    console.error('Command error:', error);
    await conn.reply(m.chat, "❌ Failed to generate serial number", m);
  }
};

handler.help = ['myns'];
handler.tags = ['xp'];
handler.command = /^(myns|ceksn)$/i;
handler.register = true;
export default handler;