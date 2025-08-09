const handler = async (m, { conn, isPrems }) => {
  const datas = global
  const idioma = datas.db.data.users[m.sender].language || global.defaultLenguaje
  const _translate = JSON.parse(fs.readFileSync(`./src/languages/${idioma}.json`))
  const tradutor = _translate.plugins.rpg_work

  global.work = tradutor.text1;

  let enviando;
  if (enviando) return
  enviando = true
  const hasil = Math.floor(Math.random() * 5000);
  const time = global.db.data.users[m.sender].lastwork + 600000;
  if (new Date - global.db.data.users[m.sender].lastwork < 600000) throw `⚔️ *Wait a moment brave adventurer!* ⚔️\n\n*—◉ Return to your adventure in ${msToTime(time - new Date())} ⏳*`;
  conn.sendMessage(m.chat, { text: `🏞️ *You embark on an exciting adventure:*\n\n🛠️ *${pickRandom(global.work)}*\n\n*You earned ${hasil} exp for your bravery!*` }, { quoted: m });
  global.db.data.users[m.sender].exp += hasil;
  global.db.data.users[m.sender].lastwork = new Date() * 1;
  enviando = false
};
handler.help = ['work'];
handler.tags = ['xp'];
handler.command = /^(work|trabajar|chambear)$/i
handler.fail = null;
export default handler;

function msToTime(duration) {
  const milliseconds = parseInt((duration % 1000) / 100);
  let seconds = Math.floor((duration / 1000) % 60);
  let minutes = Math.floor((duration / (1000 * 60)) % 60);
  let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  hours = (hours < 10) ? '0' + hours : hours;
  minutes = (minutes < 10) ? '0' + minutes : minutes;
  seconds = (seconds < 10) ? '0' + seconds : seconds;
  return minutes + ' minutes ' + seconds + ' seconds ';
}

function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())];
}