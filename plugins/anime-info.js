import translate from '@vitalets/google-translate-api';

const handler = async (m, { conn, text }) => {
  try {
    if (!text) {
      return m.reply('❌ Please provide an anime title\nExample: *!animeinfo Jujutsu Kaisen*');
    }

    // 1. Search anime using Jikan API directly
    let result;
    let retryAfter = 0;
    try {
      const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(text)}&limit=1`);

      if (response.status === 429) {
        retryAfter = parseInt(response.headers.get('Retry-After')) || 1;
        throw new Error(`Rate limited - try again in ${retryAfter} seconds`);
      }

      if (!response.ok) throw new Error(`API Error: ${response.status}`);

      const data = await response.json();
      result = data.data?.[0];
    } catch (e) {
      console.error('API Error:', e);
      if (retryAfter > 0) {
        return m.reply(`⚠️ Too many requests. Please wait ${retryAfter} seconds and try again.`);
      }
      return m.reply('⚠️ Anime info service unavailable. Try again later.');
    }

    if (!result) {
      return m.reply('🔍 Anime not found. Try *!animeinfo Naruto*');
    }

    // 2. Get translations with fallbacks
    const getTranslation = async (text) => {
      if (!text) return 'Not available';
      try {
        const res = await translate(text, { to: 'en' });
        return res.text;
      } catch {
        return text;
      }
    };

    const [synopsis, background] = await Promise.all([
      getTranslation(result.synopsis),
      getTranslation(result.background || '')
    ]);

    // 3. Format response
    const info = `
🎌 *${result.title}* ${result.year ? `(${result.year})` : ''}
${result.title_japanese ? `(${result.title_japanese})` : ''}

📜 *Synopsis:*
${synopsis}

${background && background !== 'Not available' ? `📖 *Background:*\n${background}\n\n` : ''}
ℹ️ *Details:*
• Type: ${result.type || '?'}
• Status: ${result.status?.replace(/_/g, ' ') || '?'}
• Episodes: ${result.episodes || '?'}
• Rating: ${result.rating || '?'}
• Score: ${result.score || '?'}
${result.genres?.length ? `• Genres: ${result.genres.map(g => g.name).join(', ')}\n` : ''}
${result.studios?.length ? `• Studio: ${result.studios.map(s => s.name).join(', ')}\n` : ''}

🔗 *Links:*
${result.trailer?.url ? `Trailer: ${result.trailer.url}\n` : ''}More info: ${result.url || 'Not available'}`;

    // 4. Send result
    if (result.images?.jpg?.image_url) {
      await conn.sendFile(m.chat, result.images.jpg.image_url, 'animeinfo.jpg', info.trim(), m);
    } else {
      await m.reply(info.trim());
    }

  } catch (error) {
    console.error('Global Error:', error);
    m.reply('❌ An error occurred. Please try again later.');
  }
};

handler.help = ['animeinfo <title>'];
handler.tags = ['anime'];
handler.command = /^(animeinfo|ainfo)$/i;
export default handler;