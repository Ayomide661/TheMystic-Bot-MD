const handler = async (m, {conn, text, usedPrefix, command}) => {
  const datas = global;
  const idioma = datas.db.data.users[m.sender].language || global.defaultLenguaje;
  const _translate = JSON.parse(fs.readFileSync(`./src/languages/${idioma}.json`));
  const translator = _translate.plugins.owner_addprem;

  let who;
  if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m?.quoted?.sender : false;
  else who = m.chat;
  
  const textpremERROR = `${translator.texto1[0]} ${usedPrefix + command} @${m.sender.split`@`[0]} 1*\n*◉ ${usedPrefix + command} 1 ${translator.texto1[1]}`;
  if (!who) return m.reply(textpremERROR, null, {mentions: conn.parseMention(textpremERROR)});

  const user = global.db.data.users[who];
  const txt = text.replace('@' + who.split`@`[0], '').trim();
  const name = '@' + who.split`@`[0];

  const ERROR = `${translator.texto2[0]} ${'@' + who.split`@`[0]} ${translator.texto2[1]}`;
  if (!user) return m.reply(ERROR, null, {mentions: conn.parseMention(ERROR)});

  const tenSeconds = 10 * 1000;
  const oneHour = 60 * 60 * 1000 * txt;
  const oneDay = 24 * oneHour * txt;
  const oneWeek = 7 * oneDay * txt;
  const oneMonth = 30 * oneDay * txt;
  const now = Date.now();

  if (command == 'addprem' || command == 'userpremium') {
    if (now < user.premiumTime) user.premiumTime += oneHour;
    else user.premiumTime = now + oneHour;
    user.premium = true;
    const timeLeft = (user.premiumTime - now) / 1000;
    const textprem1 = `${translator.texto3[0]} ${name} ${translator.texto3[1]} ${txt} ${translator.texto4[0]} ${timeLeft} ${translator.texto5[0]}`;
    m.reply(textprem1, null, {mentions: conn.parseMention(textprem1)});
  }

  if (command == 'addprem2' || command == 'userpremium2') {
    if (now < user.premiumTime) user.premiumTime += oneDay;
    else user.premiumTime = now + oneDay;
    user.premium = true;
    const timeLeft = (user.premiumTime - now) / 1000 / 60 / 60;
    const textprem2 = `${translator.texto3[0]} ${name} ${translator.texto3[1]} ${txt} ${translator.texto4[1]}: ${timeLeft} ${translator.texto5[1]}`;
    m.reply(textprem2, null, {mentions: conn.parseMention(textprem2)});
  }

  if (command == 'addprem3' || command == 'userpremium3') {
    if (now < user.premiumTime) user.premiumTime += oneWeek;
    else user.premiumTime = now + oneWeek;
    user.premium = true;
    formatTime(user.premiumTime - now).then((timeleft) => {
      const textprem3 = `${translator.texto3[0]} ${name} ${translator.texto3[1]} ${txt} ${translator.texto4[2]} ${timeleft}*`;
      m.reply(textprem3, null, {mentions: conn.parseMention(textprem3)});
    });
  }

  if (command == 'addprem4' || command == 'userpremium4') {
    if (now < user.premiumTime) user.premiumTime += oneMonth;
    else user.premiumTime = now + oneMonth;
    user.premium = true;
    formatTime(user.premiumTime - now).then((timeleft) => {
      const textprem4 = `${translator.texto3[0]} ${name} ${translator.texto3[1]} ${txt} ${translator.texto4[3]} ${timeleft}*`;
      m.reply(textprem4, null, {mentions: conn.parseMention(textprem4)});
    });
  }
};

handler.help = ['addprem [@user] <days>'];
handler.tags = ['owner'];
handler.command = ['addprem', 'userpremium', 'addprem2', 'userpremium2', 'addprem3', 'userpremium3', 'addprem4', 'userpremium4'];
handler.group = true;
handler.rowner = true;
export default handler;

async function formatTime(ms) {
  let seconds = Math.floor(ms / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  seconds %= 60;
  minutes %= 60;
  hours %= 24;
  
  let timeString = '';
  if (days) timeString += `${days} day${days > 1 ? 's' : ''} `;
  if (hours) timeString += `${hours} hour${hours > 1 ? 's' : ''} `;
  if (minutes) timeString += `${minutes} minute${minutes > 1 ? 's' : ''} `;
  if (seconds) timeString += `${seconds} second${seconds > 1 ? 's' : ''} `;
  
  return timeString.trim();
}