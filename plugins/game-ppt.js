const handler = async (m, {conn, text, command, usedPrefix, args}) => {
  const datas = global
  const language = datas.db.data.users[m.sender].language || global.defaultLanguage
  const _translate = JSON.parse(fs.readFileSync(`./src/languages/${language}.json`))
  const translator = _translate.plugins.game_rps

  const pp = 'https://telegra.ph/file/c7924bf0e0d839290cc51.jpg';

  // 60000 = 1 minute // 30000 = 30 seconds // 15000 = 15 seconds // 10000 = 10 seconds
  const time = global.db.data.users[m.sender].wait + 10000;
  if (new Date - global.db.data.users[m.sender].wait < 10000) throw `${translator.texto1} ${Math.floor((time - new Date()) / 1000)} ${translator.texto2}`;

  if (!args[0]) return conn.reply(m.chat, `${translator.texto3[0]} ${usedPrefix + command} rock*\n*◉ ${usedPrefix + command} paper*\n*◉ ${usedPrefix + command} scissors*`, m);

  let astro = Math.random();
  if (astro < 0.34) {
    astro = 'rock';
  } else if (astro > 0.34 && astro < 0.67) {
    astro = 'scissors';
  } else {
    astro = 'paper';
  }
  const textm = text.toLowerCase();
  if (textm == astro) {
    global.db.data.users[m.sender].exp += 500;
    m.reply(`${translator.texto4[0]} ${textm}*\n${translator.texto4[1]} ${astro}*\n${translator.texto4[2]}`);
  } else if (text == 'paper') {
    if (astro == 'rock') {
      global.db.data.users[m.sender].exp += 1000;
      m.reply(`${translator.texto5[0]} ${textm}*\n${translator.texto5[1]} ${astro}*\n${translator.texto5[2]}`);
    } else {
      global.db.data.users[m.sender].exp -= 300;
      m.reply(`${translator.texto6[0]} ${textm}*\n${translator.texto6[1]}  ${astro}*\n${translator.texto6[2]} `);
    }
  } else if (text == 'scissors') {
    if (astro == 'paper') {
      global.db.data.users[m.sender].exp += 1000;
      m.reply(`${translator.texto7[0]} ${textm}*\n${translator.texto7[1]} ${astro}*\n${translator.texto7[2]}`);
    } else {
      global.db.data.users[m.sender].exp -= 300;
      m.reply(`${translator.texto8[0]} ${textm}*\n${translator.texto8[1]} ${astro}*\n${translator.texto8[2]}`);
    }
  } else if (textm == 'scissors') {
    if (astro == 'paper') {
      global.db.data.users[m.sender].exp += 1000;
      m.reply(`${translator.texto9[0]} ${textm}*\n${translator.texto9[1]} ${astro}*\n${translator.texto9[2]}`);
    } else {
      global.db.data.users[m.sender].exp -= 300;
      m.reply(`${translator.texto10[0]} ${textm}*\n${translator.texto10[1]} ${astro}*\n${translator.texto10[2]}`);
    }
  } else if (textm == 'paper') {
    if (astro == 'rock') {
      global.db.data.users[m.sender].exp += 1000;
      m.reply(`${translator.texto11[0]} ${textm}*\n${translator.texto11[1]} ${astro}*\n${translator.texto11[2]}`);
    } else {
      global.db.data.users[m.sender].exp -= 300;
      m.reply(`${translator.texto12[0]} ${textm}*\n${translator.texto12[1]} ${astro}*\n${translator.texto12[2]}`);
    }
  } else if (textm == 'rock') {
    if (astro == 'scissors') {
      global.db.data.users[m.sender].exp += 1000;
      m.reply(`${translator.texto13[0]} ${textm}*\n${translator.texto13[1]} ${astro}*\n${translator.texto13[2]}`);
    } else {
      global.db.data.users[m.sender].exp -= 300;
      m.reply(`${translator.texto14[0]} ${textm}*\n${translator.texto14[1]} ${astro}*\n${translator.texto14[2]}`);
    }
  }
  global.db.data.users[m.sender].wait = new Date * 1;
};
handler.help = ['rps'];
handler.tags = ['game'];
handler.command = /^(rps)$/i;
export default handler;