import axios from 'axios';

const handler = async (m, {conn, usedPrefix, command, text}) => {
  if (!text) {
    return conn.reply(m.chat, `*Please specify a character!*\n\nExample: *${usedPrefix}anime akira*\n\nAvailable characters:\n• akira\n• akiyama\n• anna\n• asuna\n• ayuzawa\n• boruto\n• chiho\n• chitoge\n• deidara\n• erza\n• elaina\n• eba\n• emilia\n• hestia\n• hinata\n• inori\n• isuzu\n• itachi\n• itori\n• kaga\n• kagura\n• kaori\n• keneki\n• kotori\n• kurumi\n• madara\n• mikasa\n• miku\n• minato\n• naruto\n• nezuko\n• sagiri\n• sasuke\n• sakura\n• cosplay`, m);
  }
  
  const character = text.toLowerCase();
  const validCharacters = ['akira', 'akiyama', 'anna', 'asuna', 'ayuzawa', 'boruto', 'chiho', 'chitoge', 'deidara', 'erza', 'elaina', 'eba', 'emilia', 'hestia', 'hinata', 'inori', 'isuzu', 'itachi', 'itori', 'kaga', 'kagura', 'kaori', 'keneki', 'kotori', 'kurumi', 'madara', 'mikasa', 'miku', 'minato', 'naruto', 'nezuko', 'sagiri', 'sasuke', 'sakura', 'cosplay'];
  
  if (!validCharacters.includes(character)) {
    return conn.reply(m.chat, `*Invalid character!*\n\nAvailable characters:\n• akira\n• akiyama\n• anna\n• asuna\n• ayuzawa\n• boruto\n• chiho\n• chitoge\n• deidara\n• erza\n• elaina\n• eba\n• emilia\n• hestia\n• hinata\n• inori\n• isuzu\n• itachi\n• itori\n• kaga\n• kagura\n• kaori\n• keneki\n• kotori\n• kurumi\n• madara\n• mikasa\n• miku\n• minato\n• naruto\n• nezuko\n• sagiri\n• sasuke\n• sakura\n• cosplay`, m);
  }
  
  try {
    const res = (await axios.get(`https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/anime-${character}.json`)).data;
    const image = await res[Math.floor(res.length * Math.random())];
    conn.sendFile(m.chat, image, 'anime.jpg', `_${character}_`, m);
  } catch (error) {
    conn.reply(m.chat, '*Error fetching image!*', m);
  }
};

handler.help = ['anime <character>'];
handler.tags = ['anime'];
handler.command = /^(anime)$/i;

export default handler;