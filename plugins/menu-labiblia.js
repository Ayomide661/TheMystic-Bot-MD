import fetch from 'node-fetch';

const handler = async (m, {conn, usedPrefix, usedPrefix: _p, __dirname, text, isPrems}) => {
  const datas = global;
  const idioma = datas.db.data.users[m.sender].language || global.defaultLenguaje; // User's language or default language
  const _translate = JSON.parse(fs.readFileSync(`./src/languages/${idioma}.json`)); // Load translation file
  const tradutor = _translate.plugins.menu_labiblia; // Get translations for this menu

  // Check if "modohorny" is enabled in group chats
  if (!db.data.chats[m.chat].modohorny && m.isGroup) throw `${tradutor.texto1[0]} ${usedPrefix}enable modohorny*`; 

  try {
    const pp = imagen5; // Image for the menu
    const vn = './src/assets/audio/01J673V13NHPW7FA028ZPYC18Q.mp3'; // Audio file
    const d = new Date(new Date + 3600000);
    const locale = 'es'; // Spanish locale
    const week = d.toLocaleDateString(locale, {weekday: 'long'}); // Day of week
    const date = d.toLocaleDateString(locale, {day: 'numeric', month: 'long', year: 'numeric'}); // Full date
    const _uptime = process.uptime() * 1000; // Bot uptime in ms
    const uptime = clockString(_uptime); // Formatted uptime
    const user = global.db.data.users[m.sender];
    const {money, joincount} = global.db.data.users[m.sender];
    const {exp, limit, level, role} = global.db.data.users[m.sender];
    const rtotalreg = Object.values(global.db.data.users).filter((user) => user.registered == true).length; // Count registered users
    const more = String.fromCharCode(8206);
    const readMore = more.repeat(850);
    const taguser = '@' + m.sender.split('@s.whatsapp.net')[0]; // Mention user
    
    // Array of random document types
    const doc = ['pdf', 'zip', 'vnd.openxmlformats-officedocument.presentationml.presentation', 'vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const document = doc[Math.floor(Math.random() * doc.length)];

    // Menu text structure
    const str = `╭═══〘 ✯✯✯✯✯✯✯✯✯ 〙══╮
║    ◉— *The Mystic - Bot* —◉
║≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡║
║➤ ${tradutor.texto1[1]} ${taguser}*
╰═══╡✯✯✯✯✯✯✯✯✯╞═══╯

┏━━━━━━━━━━━━━━━━┓
┃ ${tradutor.texto1[2]}
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡┃
┣ ඬ⃟ 🔞 _${usedPrefix}pack_
┣ ඬ⃟ 🔞 _${usedPrefix}pack2_
┣ ඬ⃟ 🔞 _${usedPrefix}pack3_
┣ ඬ⃟ 🔞 _${usedPrefix}videoxxx_
┣ ඬ⃟ 🔞 _${usedPrefix}videolesbixxx_
┣ ඬ⃟ 🔞 _${usedPrefix}tetas_ (boobs)
┣ ඬ⃟ 🔞 _${usedPrefix}booty_
┣ ඬ⃟ 🔞 _${usedPrefix}ecchi_
┣ ඬ⃟ 🔞 _${usedPrefix}furro_ (furry)
┣ ඬ⃟ 🔞 _${usedPrefix}imagenlesbians_ (lesbian images)
┣ ඬ⃟ 🔞 _${usedPrefix}panties_
┣ ඬ⃟ 🔞 _${usedPrefix}pene_ (penis)
┣ ඬ⃟ 🔞 _${usedPrefix}porno_ (porn)
┣ ඬ⃟ 🔞 _${usedPrefix}randomxxx_ (random porn)
┣ ඬ⃟ 🔞 _${usedPrefix}pechos_ (breasts)
┣ ඬ⃟ 🔞 _${usedPrefix}yaoi_
┣ ඬ⃟ 🔞 _${usedPrefix}yaoi2_
┣ ඬ⃟ 🔞 _${usedPrefix}yuri_
┣ ඬ⃟ 🔞 _${usedPrefix}yuri2_
┣ ඬ⃟ 🔞 _${usedPrefix}trapito_ (traps)
┣ ඬ⃟ 🔞 _${usedPrefix}hentai_
┣ ඬ⃟ 🔞 _${usedPrefix}nsfwloli_
┣ ඬ⃟ 🔞 _${usedPrefix}nsfworgy_
┣ ඬ⃟ 🔞 _${usedPrefix}nsfwfoot_ (foot fetish)
┣ ඬ⃟ 🔞 _${usedPrefix}nsfwass_ (ass)
┣ ඬ⃟ 🔞 _${usedPrefix}nsfwbdsm_
┣ ඬ⃟ 🔞 _${usedPrefix}nsfwcum_
┣ ඬ⃟ 🔞 _${usedPrefix}nsfwero_ (erotic)
┣ ඬ⃟ 🔞 _${usedPrefix}nsfwfemdom_ (female domination)
┣ ඬ⃟ 🔞 _${usedPrefix}nsfwglass_
┣ ඬ⃟ 🔞 _${usedPrefix}hentaipdf *<text>*_
┣ ඬ⃟ 🔞 _${usedPrefix}hentaisearch *<text>*_
┗━━━━━━━━━━━━━━━━┛`.trim();

    if (m.isGroup) {
      // Send to group with mention
      await conn.sendMessage(m.chat, {image: pp, caption: str.trim(), mentions: [...str.matchAll(/@([0-9]{5,16}|0)/g)].map((v) => v[1] + '@s.whatsapp.net')}, {quoted: m});
      await conn.sendFile(m.chat, vn, './src/assets/audio/01J673V13NHPW7FA028ZPYC18Q.mp3', null, m, true, {type: 'audioMessage', ptt: true});
    } else {
      // Send to private chat
      const fkontak2 = {'key': {'participants': '0@s.whatsapp.net', 'remoteJid': 'status@broadcast', 'fromMe': false, 'id': 'Halo'}, 'message': {'contactMessage': {'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`}}, 'participant': '0@s.whatsapp.net'};
      await conn.sendMessage(m.chat, {image: pp, caption: str.trim(), mentions: [...str.matchAll(/@([0-9]{5,16}|0)/g)].map((v) => v[1] + '@s.whatsapp.net')}, {quoted: fkontak2});
      await conn.sendFile(m.chat, vn, './src/assets/audio/01J673V13NHPW7FA028ZPYC18Q.mp3', null, m, true, {type: 'audioMessage', ptt: true});
    }
  } catch {
    conn.reply(m.chat, tradutor.texto1[3], m); // Error message
  }
};

// Command triggers
handler.command = /^(menulabiblia|labiblia|Labiblia)$/i;
handler.exp = 50; // Experience points
handler.fail = null;
export default handler;

// Function to format time
function clockString(ms) {
  const h = isNaN(ms) ? '--' : Math.floor(ms / 3600000);
  const m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
  const s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
  return [h, m, s].map((v) => v.toString().padStart(2, 0)).join(':');
}