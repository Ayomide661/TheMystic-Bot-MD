


const handler = async (m, { conn }) => {
  const datas = global
  const idioma = datas.db.data.users[await m.sender].language || global.defaultLenguaje
  const _translate = JSON.parse(fs.readFileSync(`./src/languages/${idioma}.json`))
  const tradutor = _translate.plugins.owner_chetar

    const user = global.db.data.users[await m.sender];
        conn.sendMessage(m.chat, {text: `*[❗] @${await m.sender.split('@')[0]} ${tradutor.texto1}`, mentions: [await m.sender]}, {quoted: m});
      global.db.data.users[await m.sender].money = Infinity;
    global.db.data.users[await m.sender].limit = Infinity;
  global.db.data.users[await m.sender].level = Infinity;
 global.db.data.users[await m.sender].exp = Infinity;
};
handler.help = ['cheat'];
handler.tags = ['owner'];
handler.command = /^(ilimitado|infiniy|chetar)$/i;
handler.rowner = true;
handler.fail = null;
export default handler;
