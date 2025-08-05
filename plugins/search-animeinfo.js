import translate from '@vitalets/google-translate-api';
import { Anime } from '@shineiichijo/marika';

const client = new Anime();

const handler = async (m, { conn, text, usedPrefix }) => {
  try {
    // Get user language
    const user = global.db.data.users[m.sender] || {};
    const lang = user.language || 'en';
    const translations = {
      en: {
        noQuery: 'Please provide an anime title\nExample: *!anime Attack on Titan*',
        notFound: 'Anime not found, please try another title',
        error: 'An error occurred, please try again later'
      },
      es: {
        noQuery: 'Por favor ingresa un título de anime\nEjemplo: *!anime Attack on Titan*',
        notFound: 'Anime no encontrado, prueba con otro título',
        error: 'Ocurrió un error, por favor intenta nuevamente'
      }
    };

    if (!text) {
      return m.reply(`❌ ${translations[lang]?.noQuery || translations.en.noQuery}`);
    }

    // Search with timeout (15 seconds)
    const anime = await Promise.race([
      client.searchAnime(text),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Search timeout')), 15000))
    ]);

    if (!anime?.data?.length) {
      return m.reply(`🔍 ${translations[lang]?.notFound || translations.en.notFound}`);
    }

    const result = anime.data[0];
    
    // Get translations in parallel
    const [synopsisTrans, backgroundTrans] = await Promise.all([
      translate(result.synopsis || '', { to: lang, autoCorrect: true }).catch(() => ({ text: 'Not available' })),
      translate(result.background || '', { to: lang, autoCorrect: true }).catch(() => ({ text: 'Not available' }))
    ]);

    // Format the response
    const animeInfo = `
🎌 *${result.title}* ${result.year ? `(${result.year})` : ''}

📜 *Synopsis:*
${synopsisTrans.text}

📖 *Background:*
${backgroundTrans.text}

ℹ️ *Info:*
• Type: ${result.type}
• Status: ${result.status.replace(/_/g, ' ')}
• Episodes: ${result.episodes}
• Duration: ${result.duration}
• Rating: ${result.rating || 'N/A'}
• Score: ${result.score || 'N/A'}

🔗 *Links:*
Trailer: ${result.trailer.url ? result.trailer.url : 'Not available'}
More Info: ${result.url}`;

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
    const errorMsg = error.message.includes('timeout') ?
      '⏳ The anime server is taking too long to respond. Please try again later.' :
      `❌ ${translations[lang]?.error || translations.en.error}`;
    
    m.reply(errorMsg);
  }
};

handler.help = ['anime <title>'];
handler.tags = ['anime'];
handler.command = /^(anime|animeinfo)$/i;
export default handler;