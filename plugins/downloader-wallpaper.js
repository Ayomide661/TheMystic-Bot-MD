import {wallpaper} from '@bochilteam/scraper';

const handler = async (m, {conn, text, usedPrefix, command}) => {
  const datas = global;
  const language = datas.db.data.users[m.sender].language || global.defaultLanguage;
  const _translate = JSON.parse(fs.readFileSync(`./src/languages/${language}.json`));
  const translator = _translate.plugins.downloader_wallpaper;

  // Validate input
  if (!text) throw `${translator.texto1} ${usedPrefix + command} Minecraft*`;
  
  try {
    // Fetch wallpapers
    const wallpapers = await wallpaper(text);
    
    // Select random wallpaper
    const randomWallpaper = wallpapers[Math.floor(Math.random() * wallpapers.length)];
    
    // Send result
    await conn.sendFile(
      m.chat,
      randomWallpaper,
      'wallpaper.jpg', 
      `${translator.texto2} ${text}*`,
      m
    );
    
  } catch (error) {
    console.error('Wallpaper error:', error);
    await m.reply(translator.texto3 || 'Failed to fetch wallpapers');
  }
};

handler.help = ['wallpaper <query>', 'wallpaper2 <query>'];
handler.tags = ['downloader'];
handler.command = /^(wallpaper2?)$/i;
export default handler;