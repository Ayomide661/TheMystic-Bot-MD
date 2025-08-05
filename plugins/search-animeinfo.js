import translate from '@vitalets/google-translate-api';
import { Anime } from '@shineiichijo/marika';

const client = new Anime();

const handler = async (m, { conn, text, usedPrefix }) => {
  try {
    const idioma = global.db.data.users[m.sender]?.language || global.defaultLenguaje;
    const _translate = JSON.parse(fs.readFileSync(`./src/languages/${idioma}.json`));
    const tradutor = _translate.plugins.buscador_animeinfo;

    if (!text) {
      return m.reply(`🎌 *${tradutor.texto1}*\n*Ejemplo:* ${usedPrefix}anime Attack on Titan`);
    }

    // Search anime with timeout
    const searchPromise = client.searchAnime(text);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Tiempo de búsqueda excedido')), 10000);
    
    const anime = await Promise.race([searchPromise, timeoutPromise]);
    const result = anime.data[0];

    if (!result) {
      throw new Error(tradutor.texto3);
    }

    // Parallel translation requests
    const [backgroundTrans, synopsisTrans] = await Promise.all([
      translate(result.background || '', { to: idioma === 'es' ? 'es' : 'en', autoCorrect: true }),
      translate(result.synopsis || '', { to: idioma === 'es' ? 'es' : 'en', autoCorrect: true })
    ]);

    // Format anime info
    const AnimeInfo = `
🎌 *${result.title}* 🎌
${tradutor.texto2[0]} ${result.type}
${tradutor.texto2[1]} ${result.status.toUpperCase().replace(/\_/g, ' ')}
${tradutor.texto2[2]} ${result.episodes}
${tradutor.texto2[3]} ${result.duration}
${tradutor.texto2[4]} ${result.source.toUpperCase()}
${tradutor.texto2[5]} ${new Date(result.aired.from).toLocaleDateString()}
${tradutor.texto2[6]} ${result.aired.to ? new Date(result.aired.to).toLocaleDateString() : 'En emisión'}
${tradutor.texto2[7]} ${result.popularity}
${tradutor.texto2[8]} ${result.favorites}
${tradutor.texto2[9]} ${result.rating}
${tradutor.texto2[10]} ${result.rank}

📜 *${tradutor.texto2[11]}*
${backgroundTrans.text || 'No disponible'}

📖 *${tradutor.texto2[12]}*
${synopsisTrans.text || 'No disponible'}

🔗 *${tradutor.texto2[13]}* 
${result.trailer.url || 'No disponible'}

🌐 *${tradutor.texto2[14]}*
${result.url}`;

    await conn.sendFile(m.chat, 
      result.images.jpg.image_url, 
      'anime.jpg', 
      AnimeInfo, 
      m
    );

  } catch (error) {
    console.error('Anime search error:', error);
    const errorMsg = error.message.includes('Tiempo de búsqueda') ? 
      '⏳ El servidor de anime está respondiendo lentamente. Intenta nuevamente más tarde.' :
      `❌ Error: ${error.message}`;
    m.reply(errorMsg);
  }
};

handler.help = ['anime <búsqueda>'];
handler.tags = ['anime'];
handler.command = /^(anime|animeinfo)$/i;
export default handler;