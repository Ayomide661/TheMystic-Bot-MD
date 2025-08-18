const handler = async (m, {isOwner, isAdmin, conn, text, participants, args, command, usedPrefix}) => {
  const datas = global
  const language = datas.db.data.users[m.sender].language || global.defaultLanguage
  const _translate = JSON.parse(fs.readFileSync(`./src/languages/${language}.json`))
  const translator = _translate.plugins.gc_tagall

  console.log(participants)
  if (usedPrefix == 'a' || usedPrefix == 'A') return;
  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn);
    throw false;
  }
  const message = args.join` `;
  const oi = `${translator.text1[0]} ${message}`;
  let text = `${translator.text1[1]}  ${oi}\n\n${translator.text1[2]}\n`;
  for (const mem of participants) {
    text += `┣➥ @${mem.jid.split('@')[0]}\n`;
  }
  text += `*└* 𝐁𝐲 𝐓𝐡𝐞 𝐌𝐲𝐬𝐭𝐢𝐜 - 𝐁𝐨𝐭\n\n*▌│█║▌║▌║║▌║▌║▌║█*`;
  conn.sendMessage(m.chat, {text: text, mentions: participants.map((a) => a.jid)} );
};
handler.help = ['tagall <message>', 'invoke <message>'];
handler.tags = ['group'];
handler.command = /^(tagall|invoke|invocation|all|invocation)$/i;
handler.admin = true;
handler.group = true;
export default handler;