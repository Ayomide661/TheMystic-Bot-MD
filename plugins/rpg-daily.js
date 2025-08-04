import fetch from 'node-fetch';

const handler = async (m, {isPrems, conn}) => {
  const datas = global;
  const idioma = datas.db.data.users[m.sender].language || global.defaultLenguaje;
  const _translate = JSON.parse(fs.readFileSync(`./src/languages/${idioma}.json`));
  const translator = _translate.plugins.rpg_daily;

  const fkontak = m; //{'key': {'participants': '0@s.whatsapp.net', 'remoteJid': 'status@broadcast', 'fromMe': false, 'id': 'Halo'}, 'message': {'contactMessage': {'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Phone\nEND:VCARD`}}, 'participant': '0@s.whatsapp.net'};
  const mystic = './src/assets/images/menu/languages/es/menu.png';
  const dos = [md];
  const user = global.db.data.users[m.sender];
  const premium = user.premium;

  const exp = `${pickRandom([500, 600, 700, 800, 900, 999, 1000, 1300, 1500, 1800])}` * 1;
  const exppremium = `${pickRandom([1000, 1500, 1800, 2100, 2500, 2900, 3300, 3600, 4000, 4500])}` * 1;

  const money = `${pickRandom([300, 500, 700, 900, 500, 800, 900, 1100, 1350, 1500])}` * 1;
  const moneypremium = `${pickRandom([800, 1300, 1600, 1900, 2200, 2500, 2700, 3000, 3300, 3500])}` * 1;

  const potion = `${pickRandom([1, 2, 3, 4, 5])}` * 1;
  const potionpremium = `${pickRandom([2, 4, 6, 9, 12])}` * 1;

  const tiketcoin = `${pickRandom([1, 0, 0, 2, 0])}` * 1;
  const tiketcoinpremium = `${pickRandom([2, 1, 1, 3, 4])}` * 1;

  const eleksirb = `${pickRandom([1, 1, 1, 3, 1, 2, 2, 1, 5, 8])}` * 1;
  const eleksirbpremium = `${pickRandom([3, 3, 5, 3, 8, 3, 4, 4, 10, 7])}` * 1;

  const umpan = `${pickRandom([10, 20, 30, 40, 50, 60, 70, 80, 90, 100])}` * 1;
  const umpanpremium = `${pickRandom([30, 60, 90, 120, 150, 180, 210, 240, 270, 300])}` * 1;

  // let gata = Math.floor(Math.random() * 2000)

  const rewards = {
    exp: premium ? exppremium : exp,
    money: premium ? moneypremium : money,
    potion: premium ? potionpremium : potion,
    tiketcoin: premium ? tiketcoinpremium : tiketcoin,
    eleksirb: premium ? eleksirbpremium : eleksirb,
    umpan: premium ? umpanpremium : umpan,
  };

  const time = user.lastclaim + 7200000; // 2 Hours 7200000
  if (new Date() - user.lastclaim < 7200000) return await conn.reply(m.chat, `${translator.texto1[0]} *${msToTime(time - new Date())}* ${translator.texto1[1]}`, fkontak, m);
  // await conn.sendButton(m.chat, `YOU ALREADY CLAIMED YOUR GIFT 🎁\nCOME BACK IN *${msToTime(time - new Date())}* TO CLAIM AGAIN`, wm, null, [['𝗠 𝗘 𝗡 𝗨 ☘️', '/menu']], fkontak, m)
  
  let texto = '';
  for (const reward of Object.keys(rewards)) {
    if (!(reward in user)) continue;
    user[reward] += rewards[reward];
    texto += `*+${rewards[reward]}* ${global.rpgshop.emoticon(reward)}\n┃ `;
  }
  
  const text = `${translator.texto3[0]}
${translator.texto3[1]}
┃ *${premium ? translator.texto3[2] : translator.texto3[3]}*
┃ ${texto}
${translator.texto3[4]} ${premium ? '✅' : '❌'}\n${wm}`;
  
  const img = './src/assets/images/menu/languages/es/menu.png';
  await conn.sendFile(m.chat, img, 'mystic.jpg', text, fkontak);
  // await conn.sendButton(m.chat, text, texto + `\n\n🎟️ 𝗣 𝗥 𝗘 𝗠 𝗜 𝗠 ⇢ ${premium ? '✅' : '❌'}\n${wm}`, img, [['⛰️ 𝘿𝙋𝙀𝙉 𝘾𝙍𝘼𝙏𝙀 | 𝘾𝙊𝙁𝙁𝙀𝙍 ⛰️', '/cofre'], ['𝘽𝙖𝙘𝙠 𝙩𝙤 𝙈𝙚𝙣𝙪 ☘️', '/menu']], m, dos.getRandom())
  user.lastclaim = new Date() * 1;
};

handler.help = ['daily'];
handler.tags = ['xp'];
handler.command = ['daily', 'claim', 'rewards', 'gift', 'bonus'];
export default handler;

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function msToTime(duration) {
  const milliseconds = parseInt((duration % 1000) / 100);
  let seconds = Math.floor((duration / 1000) % 60);
  let minutes = Math.floor((duration / (1000 * 60)) % 60);
  let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = (hours < 10) ? '0' + hours : hours;
  minutes = (minutes < 10) ? '0' + minutes : minutes;
  seconds = (seconds < 10) ? '0' + seconds : seconds;

  return hours + ' Hours ' + minutes + ' Minutes';
}