const handler = async (m, {args, usedPrefix, command}) => {
  const datas = global
  const idioma = datas.db.data.users[m.sender].language || global.defaultLenguaje
  const _translate = JSON.parse(fs.readFileSync(`./src/languages/${idioma}.json`))
  const tradutor = _translate.plugins.game_slot

  const fa = `
${tradutor.text1} 

${tradutor.text2} 
*${usedPrefix + command} 100*`.trim();
  if (!args[0]) throw fa;
  if (isNaN(args[0])) throw fa;
  const apuesta = parseInt(args[0]);
  const users = global.db.data.users[m.sender];
  const time = users.lastslot + 10000;
  if (new Date - users.lastslot < 10000) throw `${tradutor.text3[0]} ${msToTime(time - new Date())} ${tradutor.text3[1]}`;
  if (apuesta < 100) throw tradutor.text4;
  if (users.exp < apuesta) {
    throw tradutor.text5;
  }
  const emojis = ['🐋', '🐉', '🕊️', '🍎', '🍒', '🍇']; // More emojis = harder to win
  let a = Math.floor(Math.random() * emojis.length);
  let b = Math.floor(Math.random() * emojis.length);
  let c = Math.floor(Math.random() * emojis.length);
  const x = [];
  const y = [];
  const z = [];
  for (let i = 0; i < 3; i++) {
    x[i] = emojis[a];
    a++;
    if (a == emojis.length) a = 0;
  }
  for (let i = 0; i < 3; i++) {
    y[i] = emojis[b];
    b++;
    if (b == emojis.length) b = 0;
  }
  for (let i = 0; i < 3; i++) {
    z[i] = emojis[c];
    c++;
    if (c == emojis.length) c = 0;
  }
  let end;
  if (a == b && b == c) {
    const win = apuesta * 5; // 5x payout for jackpot
    end = `${tradutor.text6} +${win} XP 🎉*`;
    users.exp += win;
  } else if (a == b || a == c || b == c) {
    const win = Math.floor(apuesta * 1.5); // 1.5x for two matches
    end = `${tradutor.text7} +${win} XP!*`;
    users.exp += win;
  } else {
    end = `${tradutor.text8} -${apuesta} XP*`;
    users.exp -= apuesta;
  }
  users.lastslot = new Date * 1;
  return await m.reply(
      `
🎰 | *SLOTS* 
────────
${x[0]} : ${y[0]} : ${z[0]}
${x[1]} : ${y[1]} : ${z[1]}
${x[2]} : ${y[2]} : ${z[2]}
────────
🎰 | ${end}`);
};