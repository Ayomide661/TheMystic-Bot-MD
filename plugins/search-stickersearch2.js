import fetch from 'node-fetch';
import { googleImage } from '@bochilteam/scraper';

const handler = async (m, { text, usedPrefix, command, conn }) => {
  // Language system (keep your existing implementation)
  const datas = global;
  const idioma = datas.db.data.users[m.sender].language || global.defaultLenguaje;
  const _translate = JSON.parse(fs.readFileSync(`./src/languages/${idioma}.json`));
  const tradutor = _translate.plugins.buscador_stickersearch2;

  if (!text) throw `*${tradutor.text1}*`; // "Please enter a search term"

  try {
    // Get random image from Google for preview
    const res2 = await googleImage(text);
    const sfoto = res2.getRandom();
    
    // Fetch stickers from API
    const json = await fetch(`https://api.lolhuman.xyz/api/stickerwa?apikey=${lolkeysapi}&query=${text}`);
    const jsons = await json.json();
    
    if (!jsons.result || !jsons.result.length) {
      throw new Error('No stickers found');
    }

    // Format results
    const { stickers } = jsons.result[0];
    const res = jsons.result.map((v, index) => 
      `🔍 *Result ${1 + index}*\n` +
      `📛 *Title:* ${v.title}\n` +
      `👤 *Author:* ${v.author}\n` +
      `🔗 *URL:* ${v.url}`
    ).join('\n\n───\n\n');

    // Send image preview with sticker info
    await conn.sendFile(
      m.chat, 
      sfoto, 
      'sticker-preview.jpg', 
      `*Sticker Search Results for:* ${text}\n\n${res}`, 
      m
    );

  } catch (error) {
    console.error('Sticker search error:', error);
    await m.reply('*[❗] ERROR, please try again or use a different search term*');
  }
};

handler.help = ['stickersearch2 <query>', 'searchsticker2 <query>'];
handler.command = ['stickersearch2', 'searchsticker2', 'stickerssearch2', 'searchstickers2'];
export default handler;