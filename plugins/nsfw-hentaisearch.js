import cheerio from 'cheerio';
import axios from 'axios';
import fs from 'fs';

const handler = async (m, {conn, text, __dirname, usedPrefix, command}) => {
  try {
    const datas = global;
    const idioma = datas.db.data.users[m.sender].language || global.defaultLenguaje;
    const _translate = JSON.parse(fs.readFileSync(`./src/languages/${idioma}.json`));
    const tradutor = _translate.plugins.adult_hentaisearch;

    if (!global.db.data.chats[m.chat].modohorny && m.isGroup) throw tradutor.texto1;
    if (!text) throw tradutor.texto2;

    const searchResults = await searchHentai(text);
    
    if (!searchResults || searchResults.result.length === 0) {
      return conn.sendFile(
        m.chat, 
        'https://pictures.hentai-foundry.com/e/Error-Dot/577798/Error-Dot-577798-Zero_Two.png', 
        'error.jpg', 
        tradutor.texto3, 
        m
      );
    }

    let teks = searchResults.result.map((v, i) => `
${i+1}. *_${v.title}_*
↳ 📺 *_Vistas:_* ${v.views}
↳ 🎞️ *_Link:_* ${v.url}`).join('\n\n');

    const randomThumbnail = searchResults.result[Math.floor(Math.random() * searchResults.result.length)].thumbnail;

    await conn.sendFile(m.chat, randomThumbnail, 'thumbnail.jpg', teks, m);
    
  } catch (error) {
    console.error(error);
    m.reply(tradutor.texto3 || 'Error occurred while searching');
  }
};

handler.tags = ['nsfw'];
handler.help = ['hentaisearch'];
handler.command = /^(hentaisearch|searchhentai)$/i;
export default handler;

async function searchHentai(search) {
  try {
    const { data } = await axios.get('https://hentai.tv/?s=' + encodeURIComponent(search), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(data);
    const results = [];

    // Updated selectors - you may need to adjust these based on the current site structure
    $('div.item').each((i, el) => {
      const thumbnail = $(el).find('img').attr('src');
      const title = $(el).find('h2 a').text().trim();
      const views = $(el).find('.meta').text().trim();
      const url = $(el).find('h2 a').attr('href');
      
      if (thumbnail && title && url) {
        results.push({
          thumbnail,
          title,
          views: views || 'N/A',
          url
        });
      }
    });

    return {
      coder: 'rem-comp',
      result: results,
      warning: 'Copyright © 2023'
    };

  } catch (error) {
    console.error('Search error:', error);
    return { result: [] };
  }
}