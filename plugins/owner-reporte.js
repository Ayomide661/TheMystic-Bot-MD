const handler = async (m, {conn, text, usedPrefix, command}) => {
  const datas = global
  const language = datas.db.data.users[m.sender].language || global.defaultLanguage
  const _translate = JSON.parse(fs.readFileSync(`./src/languages/${language}.json`))
  const translator = _translate.plugins.owner_report

  if (!text) throw `${translator.text1[0]}\n*${usedPrefix + command} ${translator.text1[1]} ${usedPrefix}play ${translator.text1[2]}`;
  if (text.length < 10) throw translator.text2;
  if (text.length > 1000) throw translator.text3;
  const message = `${translator.text4[0]} wa.me/${m.sender.split`@`[0]}\n${translator.text4[1]} ${text}\n*┴*`;
  conn.reply('5219992095479@s.whatsapp.net', m.quoted ? message + m.quoted.text : message, null, {contextInfo: {mentionedJid: [m.sender]}});
  conn.reply('584125778026@s.whatsapp.net', m.quoted ? message + m.quoted.text : message, null, {contextInfo: {mentionedJid: [m.sender]}});
  m.reply(translator.text5);
};
handler.help = ['report <text>'];
handler.tags = ['info'];
handler.command = /^report$/i;
export default handler;