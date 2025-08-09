const handler = async (m, {command, usedPrefix, text}) => {
  const datas = global
  const idioma = datas.db.data.users[m.sender].language || global.defaultLenguaje
  const _translate = JSON.parse(fs.readFileSync(`./src/languages/${idioma}.json`))
  const tradutor = _translate.plugins.owner_addmsg

  const M = m.constructor;
  const which = command.replace(/agregar/i, '');
  if (!m.quoted) throw tradutor.text1;
  if (!text) throw `${tradutor.text2[0]} *${usedPrefix}list${which}* ${tradutor.text2[1]}`;
  const msgs = global.db.data.msgs;
  if (text in msgs) throw `*[❗𝐈𝐍𝐅𝐎❗] '${text}' ${tradutor.text3}`;
  msgs[text] = M.toObject(await m.getQuotedObj());
  m.reply(`${tradutor.text4[0]} '${text}'${tradutor.text4[1]} ${usedPrefix}ver${which} ${text}*`);
};
handler.help = ['vn', 'msg', 'video', 'audio', 'img', 'sticker'].map((v) => 'add' + v + ' <text>');
handler.tags = ['database'];
handler.command = /^agregar(vn|msg|video|audio|img|sticker)$/;
handler.rowner = true;
export default handler;