const handler = (m) => m;

export async function all(m) {
  const datas = global
  const idioma = datas.db.data.users[m.sender].language || global.defaultLenguaje
  const _translate = JSON.parse(fs.readFileSync(`./src/languages/${idioma}.json`))
  const tradutor = _translate.plugins._premium

  for (const user of Object.values(global.db.data.users)) {
    if (user.premiumTime != 0 && user.premium) {
      if (new Date() * 1 >= user.premiumTime) {
        user.premiumTime = 0;
        user.premium = false;
        const JID = Object.keys(global.db.data.users).find((key) => global.db.data.users[key] === user);
        const usuarioJid = JID.split`@`[0];
        const texto = `*[❗] @${usuarioJid} ${tradutor.text1}`;
        await this.sendMessage(JID, {text: texto, mentions: [JID]}, {quoted: ''});
      }
    }
  }
}