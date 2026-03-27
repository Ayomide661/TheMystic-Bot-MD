import fetch from 'node-fetch';

const handler = async (m, {isPrems, conn}) => {
  const datas = global;
  const idioma = datas.db.data.users[m.sender].language || global.defaultLenguaje;
  const _translate = JSON.parse(fs.readFileSync(`./src/languages/${idioma}.json`));
  const translator = _translate.plugins.rpg_daily;

  const fkontak = m;
  const mystic = './src/assets/images/menu/languages/es/menu.png';
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

  const rewards = {
    exp: premium ? exppremium : exp,
    money: premium ? moneypremium : money,
    potion: premium ? potionpremium : potion,
    tiketcoin: premium ? tiketcoinpremium : tiketcoin,
    eleksirb: premium ? eleksirbpremium : eleksirb,
    umpan: premium ? umpanpremium : umpan,
  };

  const time = user.lastclaim + 7200000; // 2 Hours
  if (new Date() - user.lastclaim < 7200000) return await conn.reply(m.chat, `${translator.text1[0]} *${msToTime(time - new Date())}* ${translator.text1[1]}`, fkontak, m);

  let rewardText = '';
  for (const reward of Object.keys(rewards)) {
    if (!(reward in user)) continue;
    user[reward] += rewards[reward];
    rewardText += `*+${rewards[reward]}* ${global.rpgshop.emoticon(reward)}\n┃ `;
  }

  const message = `${translator.text3[0]}
${translator.text3[1]}
┃ *${premium ? translator.text3[2] : translator.text3[3]}*
┃ ${rewardText}
${translator.text3[4]} ${premium ? '✅' : '❌'}\n${wm}`;

  const img = './src/assets/images/menu/languages/es/menu.png';
  await conn.sendFile(m.chat, img, 'mystic.jpg', message, fkontak);
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
