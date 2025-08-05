import translate from '@vitalets/google-translate-api';
import { Anime } from '@shineiichijo/marika';

const client = new Anime();

// Translation dictionary outside handler
const errorMessages = {
  en: {
    noInput: 'Please specify an anime title\nExample: *!anime Jujutsu Kaisen*',
    notFound: 'Anime not found. Try a different title',
    apiError: 'Anime service unavailable. Try again later',
    default: 'An error occurred. Please try again'
  },
  es: {
    noInput: 'Por favor escribe un anime\nEjemplo: *!anime Jujutsu Kaisen*',
    notFound: 'Anime no encontrado. Prueba otro título',
    apiError: 'Servicio de anime no disponible. Intenta más tarde',
    default: 'Ocurrió un error. Por favor intenta nuevamente'
  }
};

const handler = async (m, { conn, text }) => {
  try {
    // Get user language (default to English)
    const userLang = global.db.data.users[m.sender]?.language || 'en';
    const t = key => errorMessages[userLang]?.[key] || errorMessages.en[key];

    if (!text) return m.reply(`❌ ${t('noInput')}`);

    // 1. Try to search anime (with 10s timeout)
    let anime;
    try {
      anime = await Promise.race([
        client.searchAnime(text),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('API timeout')), 10000))
      ]);
    } catch (e) {
      console.error('API Error:', e);
      return m.reply(`⚠️ ${t('apiError')}`);
    }

    if (!anime?.data?.length) return m.reply(`🔍 ${t('notFound')}`);

    const result = anime.data[0];

    // 2. Get translations (with fallbacks)
    let synopsis = 'No synopsis available';
    let background = 'No background info';
    
    try {
      const [synopsisRes, backgroundRes] = await Promise.all([
        translate(result.synopsis || '', { to: userLang === 'es' ? 'es' : 'en' }),
        translate(result.background || '', { to: userLang === 'es' ? 'es' : 'en' })
      ]);
      synopsis = synopsisRes.text;
      background = backgroundRes.text;
    } catch (e) {
      console.error('Translation error:', e);
      // Use original text if translation fails
      synopsis = result.synopsis || synopsis;
      background = result.background || background;
    }

    // 3. Build response
    const info = `
🎌 *${result.title}* ${result.year ? `(${result.year})` : ''}

📜 ${t('synopsis')}:
${synopsis}

📖 ${t('background')}:
${background}

ℹ️ ${t('details')}:
• ${t('type')}: ${result.type || '?'}
• ${t('status')}: ${result.status?.replace(/_/g, ' ') || '?'}
• ${t('episodes')}: ${result.episodes || '?'}
• ${t('rating')}: ${result.rating || '?'}

🔗 ${result.url ? `More info: ${result.url}` : ''}`;

    // 4. Send result (with image if available)
    if (result.images?.jpg?.image_url) {
      await conn.sendFile(m.chat, result.images.jpg.image_url, 'anime.jpg', info, m);
    } else {
      await m.reply(info);
    }

  } catch (error) {
    console.error('Global error:', error);
    const userLang = global.db.data.users[m.sender]?.language || 'en';
    m.reply(`❌ ${errorMessages[userLang]?.default || errorMessages.en.default}`);
  }
};

// Add translations for anime terms
errorMessages.en.synopsis = 'Synopsis';
errorMessages.en.background = 'Background';
errorMessages.en.details = 'Details';
errorMessages.en.type = 'Type';
errorMessages.en.status = 'Status';
errorMessages.en.episodes = 'Episodes';
errorMessages.en.rating = 'Rating';

errorMessages.es.synopsis = 'Sinopsis';
errorMessages.es.background = 'Antecedentes';
errorMessages.es.details = 'Detalles';
errorMessages.es.type = 'Tipo';
errorMessages.es.status = 'Estado';
errorMessages.es.episodes = 'Episodios';
errorMessages.es.rating = 'Clasificación';

handler.help = ['anime <title>'];
handler.tags = ['anime'];
handler.command = /^(anime|animeinfo)$/i;
export default handler;