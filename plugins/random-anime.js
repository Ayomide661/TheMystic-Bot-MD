import axios from 'axios';

const handler = async (m, {conn, usedPrefix, command, text}) => {
  if (!text) {
    const characterList = `🎌 *ANIME CHARACTER IMAGES* 🎌\n\n` +
      `✨ *Available Characters:*\n` +
      `• akira      • asuna     • boruto\n` +
      `• akiyama    • ayuzawa   • chiho\n` +
      `• anna       • chitoge   • deidara\n` +
      `• erza       • elaina    • eba\n` +
      `• emilia     • hestia    • hinata\n` +
      `• inori      • isuzu     • itachi\n` +
      `• itori      • kaga      • kagura\n` +
      `• kaori      • keneki    • kotori\n` +
      `• kurumi     • madara    • mikasa\n` +
      `• miku       • minato    • naruto\n` +
      `• nezuko     • sagiri    • sasuke\n` +
      `• sakura     • cosplay\n\n` +
      `📝 *Usage:* ${usedPrefix}anime <character>\n` +
      `Example: *${usedPrefix}anime mikasa*`;
    
    return conn.sendMessage(m.chat, {
      text: characterList,
      contextInfo: {
        externalAdReply: {
          title: '🎨 Anime Character Gallery',
          body: 'Choose your favorite character!',
          thumbnailUrl: 'https://i.pinimg.com/736x/2f/70/56/2f7056b3a2c1c79f8b4c3c84c5c7c0d0.jpg',
          sourceUrl: 'https://github.com/BrunoSobrino/TheMystic-Bot-MD',
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, {quoted: m});
  }
  
  const character = text.toLowerCase();
  const validCharacters = ['akira', 'akiyama', 'anna', 'asuna', 'ayuzawa', 'boruto', 'chiho', 'chitoge', 'deidara', 'erza', 'elaina', 'eba', 'emilia', 'hestia', 'hinata', 'inori', 'isuzu', 'itachi', 'itori', 'kaga', 'kagura', 'kaori', 'keneki', 'kotori', 'kurumi', 'madara', 'mikasa', 'miku', 'minato', 'naruto', 'nezuko', 'sagiri', 'sasuke', 'sakura', 'cosplay'];
  
  if (!validCharacters.includes(character)) {
    return conn.reply(m.chat, `*Invalid character!*\n\n💡 Try one of these: *akira, naruto, mikasa, nezuko*\n📝 Use *${usedPrefix}anime* to see all options`, m);
  }
  
  try {
    await conn.reply(m.chat, `⏳ *Loading ${character} image...*`, m);
    
    const res = (await axios.get(`https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/anime-${character}.json`)).data;
    const image = await res[Math.floor(res.length * Math.random())];
    
    const caption = `🎨 *${character.toUpperCase()}* 🎨\n` +
      `━━━━━━━━━━━━━━\n` +
      `⭐ *Character:* ${character}\n` +
      `📦 *Source:* TheMystic-Bot\n` +
      `🔍 *Get more:* ${usedPrefix}anime <character>`;
    
    await conn.sendMessage(m.chat, {
      image: {url: image},
      caption: caption,
      footer: `Requested by: ${m.sender.split('@')[0]}`,
      headerType: 4,
      contextInfo: {
        mentionedJid: [m.sender],
        externalAdReply: {
          title: `Anime: ${character}`,
          body: 'Powered by TheMystic-Bot',
          thumbnailUrl: image,
          sourceUrl: 'https://github.com/BrunoSobrino/TheMystic-Bot-MD',
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, {quoted: m});
    
  } catch (error) {
    console.error(error);
    conn.reply(m.chat, `*Error!*\nFailed to fetch ${character} image\n\n💡 Try again or use a different character`, m);
  }
};

handler.help = ['anime <character>'];
handler.tags = ['anime', 'image'];
handler.command = /^(anime|character|ani)$/i;

export default handler;