import translate from '@vitalets/google-translate-api';
import marika from '@shineiichijo/marika';

// Initialize client correctly - newer versions might export client directly
const client = marika.Client || marika;

const handler = async (m, { conn, text }) => {
  try {
    if (!text) {
      return m.reply('❌ Please provide an anime title\nExample: *!anime Jujutsu Kaisen*');
    }

    // 1. Search anime with error handling
    let result;
    try {
      const search = await client.anime.search(text, { limit: 1 });
      result = search.data[0];
    } catch (e) {
      console.error('API Error:', e);
      return m.reply('⚠️ Anime service unavailable. Try again later.');
    }

    if (!result) {
      return m.reply('🔍 Anime not found. Try *!anime Naruto*');
    }

    // 2. Get translations with fallbacks
    const getTranslation = async (text) => {
      try {
        const res = await translate(text || '', { to: 'en' });
        return res.text;
      } catch {
        return text || 'Not available';
      }
    };

    const [synopsis, background] = await Promise.all([
      getTranslation(result.synopsis),
      getTranslation(result.background)
    ]);

    // 3. Format response
    const info = `
🎌 *${result.title}* ${result.year ? `(${result.year})` : ''}

📜 *Synopsis:*
${synopsis}

📖 *Background:*
${background}

ℹ️ *Details:*
• Type: ${result.type || '?'}
• Status: ${result.status?.replace(/_/g, ' ') || '?'}
• Episodes: ${result.episodes || '?'}
• Rating: ${result.rating || '?'}
• Score: ${result.score || '?'}

🔗 *Links:*
${result.trailer?.url ? `Trailer: ${result.trailer.url}\n` : ''}More info: ${result.url || 'Not available'}`;

    // 4. Send result
    if (result.images?.jpg?.image_url) {
      await conn.sendFile(m.chat, result.images.jpg.image_url, 'anime.jpg', info, m);
    } else {
      await m.reply(info);
    }

  } catch (error) {
    console.error('Global Error:', error);
    m.reply('❌ An error occurred. Please try again later.');
  }
};

handler.help = ['anime <title>'];
handler.tags = ['anime'];
handler.command = /^(anime|animeinfo)$/i;
export default handler;