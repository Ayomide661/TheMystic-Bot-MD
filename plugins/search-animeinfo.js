import translate from '@vitalets/google-translate-api';
import { Anime } from '@shineiichijo/marika';

const client = new Anime();

// Define translations outside the handler
const translations = {
  en: {
    noQuery: 'Please provide an anime title\nExample: *!anime Attack on Titan*',
    notFound: 'Anime not found, please try another title',
    error: 'An error occurred, please try again later',
    timeout: 'The anime server is taking too long to respond'
  },
  es: {
    noQuery: 'Por favor ingresa un título de anime\nEjemplo: *!anime Attack on Titan*',
    notFound: 'Anime no encontrado, prueba con otro título',
    error: 'Ocurrió un error, por favor intenta nuevamente',
    timeout: 'El servidor de anime está tardando demasiado'
  }
};

const handler = async (m, { conn, text, usedPrefix }) => {
  try {
    // Get user language
    const lang = global.db.data.users[m.sender]?.language || 'en';

    if (!text) {
      return m.reply(`❌ ${translations[lang].noQuery}`);
    }

    // Search with timeout (15 seconds)
    const anime = await Promise.race([
      client.searchAnime(text),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('timeout')), 15000))
    ]);

    if (!anime?.data?.length) {
      return m.reply(`🔍 ${translations[lang].notFound}`);
    }

    const result = anime.data[0];
    
    // Get translations
    const [synopsisTrans, backgroundTrans] = await Promise.all([
      translate(result.synopsis || '', { to: lang === 'es' ? 'es' : 'en' }).catch(() => ({ text: 'Not available' })),
      translate(result.background || '', { to: lang === 'es' ? 'es' : 'en' }).catch(() => ({ text: 'Not available' }))
    ]);

    // Format response
    const animeInfo = `
🎌 *${result.title}* ${result.year ? `(${result.year})` : ''}

📜 *Synopsis:*
${synopsisTrans.text}

📖 *Background:*
${backgroundTrans.text}

ℹ️ *Info:*
• Type: ${result.type}
• Status: ${result.status?.replace(/_/g, ' ') || 'Unknown'}
• Episodes: ${result.episodes || '?'}
• Duration: ${result.duration || 'Unknown'}
• Rating: ${result.rating || 'N/A'}
• Score: ${result.score || 'N/A'}

🔗 *Links:*
${result.trailer?.url ? `Trailer: ${result.trailer.url}` : ''}
More Info: ${result.url || 'Not available'}`;

    await conn.sendFile(
      m.chat,
      result.images.jpg.image_url,
      'anime.jpg',
      animeInfo,
      m
    );

  } catch (error) {
    console.error('Anime command error:', error);
    const lang = global.db.data.users[m.sender]?.language || 'en';
    const errorMsg = error.message.includes('timeout') 
      ? `⏳ ${translations[lang].timeout}`
      : `❌ ${translations[lang].error}`;
    
    m.reply(errorMsg);
  }
};

handler.help = ['anime <title>'];
handler.tags = ['anime'];
handler.command = /^(anime|animeinfo)$/i;
export default handler;