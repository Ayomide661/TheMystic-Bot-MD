import axios from 'axios';
import cheerio from 'cheerio';

const handler = async (m, {conn, text, usedPrefix, command}) => {
  const datas = global;
  const language = datas.db.data.users[m.sender].language || global.defaultLanguage;
  const _translate = JSON.parse(fs.readFileSync(`./src/languages/${language}.json`));
  const translator = _translate.plugins.downloader_wallpaper;

  // Validate input
  if (!text) throw `${translator.text1} ${usedPrefix + command} Minecraft*`;

  try {
    // Fetch HTML from wallpaper website
    const { data } = await axios.get(
      `https://wall.alphacoders.com/search.php?search=${encodeURIComponent(text)}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      }
    );
    
    // Parse HTML with Cheerio
    const $ = cheerio.load(data);
    const wallpapers = [];
    
    // Extract image URLs
    $('.thumb-container').each((i, element) => {
      const imgSrc = $(element).find('img').attr('src');
      if (imgSrc) {
        // Convert thumbnail URL to high-resolution URL
        const highRes = imgSrc.replace('/thumbs/', '/bigs/').replace('/thumb-', '/');
        wallpapers.push(highRes);
      }
    });
    
    // Check if we found any wallpapers
    if (wallpapers.length === 0) {
      throw new Error('No wallpapers found');
    }
    
    // Select random wallpaper
    const randomWallpaper = wallpapers[Math.floor(Math.random() * wallpapers.length)];
    
    // Send result
    await conn.sendFile(
      m.chat,
      randomWallpaper,
      'wallpaper.jpg', 
      `${translator.text2} ${text}*`,
      m
    );

  } catch (error) {
    console.error('Wallpaper error:', error);
    await m.reply(translator.text3 || 'Failed to fetch wallpapers');
  }
};

handler.help = ['wallpaper <query>', 'wallpaper2 <query>'];
handler.tags = ['downloader'];
handler.command = /^(wallpaper2?)$/i;
export default handler;