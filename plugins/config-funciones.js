const handler = async (m, {conn, usedPrefix, command, args, isOwner, isAdmin, isROwner}) => {
const datas = global
const idioma = datas.db.data.users[m.sender].language || global.defaultLenguaje
const _translate = JSON.parse(fs.readFileSync(`./src/languages/${idioma}.json`))
const tradutor = _translate.plugins.config_funciones

const optionsFull = `_*${tradutor.text1[0]}*_\n 

${tradutor.text1[1]}  | WELCOME
${tradutor.text1[2]} ${usedPrefix + command} welcome
${tradutor.text1[3]}

--------------------------------

${tradutor.text2[0]} | PUBLIC
${tradutor.text2[1]}* ${usedPrefix + command} public
${tradutor.text2[2]}
${tradutor.text2[3]}

--------------------------------

${tradutor.text3[0]} | MODOHORNY
${tradutor.text3[1]} ${usedPrefix + command} modohorny
${tradutor.text3[2]}

--------------------------------

${tradutor.text4[0]} | ANTILINK
${tradutor.text4[1]} ${usedPrefix + command} antilink
${tradutor.text4[2]}
${tradutor.text4[3]}

--------------------------------

${tradutor.text5[0]} | ANTILINK 2
${tradutor.text5[1]}  ${usedPrefix + command} antilink2
${tradutor.text5[2]}
${tradutor.text5[3]}

--------------------------------

${tradutor.text6[0]} | DETECT
${tradutor.text6[1]} ${usedPrefix + command} detect
${tradutor.text6[2]}

--------------------------------

${tradutor.text7[0]} | DETECT 2
${tradutor.text7[1]} ${usedPrefix + command} detect2
${tradutor.text7[2]}

--------------------------------

${tradutor.text8[0]} RESTRICT
${tradutor.text8[1]} ${usedPrefix + command} restrict
${tradutor.text8[2]}
${tradutor.text8[3]}
--------------------------------

${tradutor.text9[0]} | AUTOREAD
${tradutor.text9[1]} ${usedPrefix + command} autoread
${tradutor.text9[2]}
${tradutor.text9[3]}

--------------------------------

${tradutor.text10[0]} | AUDIOS
${tradutor.text10[1]} ${usedPrefix + command} audios
${tradutor.text10[2]}

--------------------------------

${tradutor.text11[0]} | AUTOSTICKER
${tradutor.text11[1]} ${usedPrefix + command} autosticker 
${tradutor.text11[2]}

--------------------------------

${tradutor.text12[0]} | PCONLY
${tradutor.text12[1]} ${usedPrefix + command} pconly
${tradutor.text12[2]}
${tradutor.text12[3]}

--------------------------------

${tradutor.text13[0]} | GCONLY
${tradutor.text13[1]} ${usedPrefix + command} gconly
${tradutor.text13[2]} 
${tradutor.text13[3]}

--------------------------------

${tradutor.text14[0]} | ANTIVIEWONCE 
${tradutor.text14[1]} ${usedPrefix + command} antiviewonce
${tradutor.text14[2]}

--------------------------------

${tradutor.text15[0]} | ANTILLAMADAS
${tradutor.text15[1]} ${usedPrefix + command} anticall
${tradutor.text15[2]} 
${tradutor.text15[3]}

--------------------------------

${tradutor.text16[0]} | ANTITOXIC
${tradutor.text16[1]} ${usedPrefix + command} antitoxic
${tradutor.text16[2]}
${tradutor.text16[3]}

--------------------------------

${tradutor.text17[0]} | ANTITRABAS
${tradutor.text17[1]}  ${usedPrefix + command} antitraba
${tradutor.text17[2]} 
${tradutor.text17[3]} 

--------------------------------

${tradutor.text18[0]} | ANTIARABES
${tradutor.text18[1]} ${usedPrefix + command} antiarabes
${tradutor.text18[2]}
${tradutor.text18[3]}

--------------------------------

${tradutor.text19[0]} | ANTIARABES 2
${tradutor.text19[1]}  ${usedPrefix + command} antiarabes2
${tradutor.text19[2]} 
${tradutor.text19[3]} 

--------------------------------

${tradutor.text20[0]} | MODOADMIN
${tradutor.text20[1]} ${usedPrefix + command} modoadmin
${tradutor.text20[2]}

--------------------------------

${tradutor.text21[0]} | SIMSIMI
${tradutor.text21[1]} ${usedPrefix + command} simsimi
${tradutor.text21[2]}

--------------------------------

${tradutor.text22[0]} | ANTIDELETE
${tradutor.text22[1]} ${usedPrefix + command} antidelete
${tradutor.text22[2]}

--------------------------------

${tradutor.text23[0]} | AUDIOS_BOT
${tradutor.text23[1]} ${usedPrefix + command} audios_bot
${tradutor.text23[2]}
${tradutor.text23[3]}

--------------------------------

${tradutor.text24[0]} | ANTISPAM
${tradutor.text24[1]} ${usedPrefix + command} antispam
${tradutor.text24[2]}
${tradutor.text24[3]}

--------------------------------

${tradutor.text25[0]} | MODEJADIBOT
${tradutor.text25[1]} ${usedPrefix + command} modejadibot
${tradutor.text25[2]} (${usedPrefix}serbot / ${usedPrefix}jadibot). 
${tradutor.text25[3]}

--------------------------------

${tradutor.text26[0]} | ANTIPRIVADO
${tradutor.text26[1]} ${usedPrefix + command} antiprivado
${tradutor.text26[2]}
${tradutor.text26[3]}`.trim();

  const isEnable = /true|enable|(turn)?on|1/i.test(command);
  const chat = global.db.data.chats[m.chat];
  const user = global.db.data.users[m.sender];
  const bot = global.db.data.settings[conn.user.jid] || {};
  const type = (args[0] || '').toLowerCase();
  let isAll = false; const isUser = false;
  switch (type) {
    case 'welcome':
      if (!m.isGroup) {
        if (!isOwner) {
          global.dfail('group', m, conn);
          throw false;
        }
      } else if (!(isAdmin || isOwner || isROwner)) {
        global.dfail('admin', m, conn);
        throw false;
      }
      chat.welcome = isEnable;
      break;
    case 'detect':
      if (!m.isGroup) {
        if (!isOwner) {
          global.dfail('group', m, conn);
          throw false;
        }
      } else if (!isAdmin) {
        global.dfail('admin', m, conn);
        throw false;
      }
      chat.detect = isEnable;
      break;
    case 'detect2':
      if (!m.isGroup) {
        if (!isOwner) {
          global.dfail('group', m, conn);
          throw false;
        }
      } else if (!isAdmin) {
        global.dfail('admin', m, conn);
        throw false;
      }
      chat.detect2 = isEnable;
      break;
    case 'simsimi':
      if (m.isGroup) {
        if (!(isAdmin || isROwner || isOwner)) {
          global.dfail('admin', m, conn);
          throw false;
        }
      }
      chat.simi = isEnable;
      break;
    case 'antiporno':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn);
          throw false;
        }
      }
      chat.antiporno = isEnable;
      break;
    case 'delete':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn);
          throw false;
        }
      }
      chat.delete = isEnable;
      break;
    case 'antidelete':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn);
          throw false;
        }
      }
      chat.antidelete = isEnable;
      break;
    case 'public':
      isAll = true;
      if (!isROwner) {
        global.dfail('rowner', m, conn);
        throw false;
      }
      global.opts['self'] = !isEnable;
      break;
    case 'antilink':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn);
          throw false;
        }
      }
      chat.antiLink = isEnable;
      break;
    case 'antilink2':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn);
          throw false;
        }
      }
      chat.antiLink2 = isEnable;
      break;
    case 'antiviewonce':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn);
          throw false;
        }
      }
      chat.antiviewonce = isEnable;
      break;
    case 'modohorny':
      if (m.isGroup) {
        if (!(isAdmin || isROwner || isOwner)) {
          global.dfail('admin', m, conn);
          throw false;
        }
      }
      chat.modohorny = isEnable;
      break;
    case 'modoadmin':
      if (m.isGroup) {
        if (!(isAdmin || isROwner || isOwner)) {
          global.dfail('admin', m, conn);
          throw false;
        }
      }
      chat.modoadmin = isEnable;
      break;
    case 'autosticker':
      if (m.isGroup) {
        if (!(isAdmin || isROwner || isOwner)) {
          global.dfail('admin', m, conn);
          throw false;
        }
      }
      chat.autosticker = isEnable;
      break;
    case 'audios':
      if (m.isGroup) {
        if (!(isAdmin || isROwner || isOwner)) {
          global.dfail('admin', m, conn);
          throw false;
        }
      }
      chat.audios = isEnable;
      break;
    case 'restrict':
      isAll = true;
      if (!(isROwner || isOwner)) {
        global.dfail('owner', m, conn);
        throw false;
      }
      bot.restrict = isEnable;
      break;
    case 'audios_bot':
      isAll = true;
      if (!(isROwner || isOwner)) {
        global.dfail('owner', m, conn);
        throw false;
      }
      bot.audios_bot = isEnable;      
      break;      
    case 'nyimak':
      isAll = true;
      if (!isROwner) {
        global.dfail('rowner', m, conn);
        throw false;
      }
      global.opts['nyimak'] = isEnable;
      break;
    case 'autoread':
      isAll = true;
      if (!(isROwner || isOwner)) {
        global.dfail('rowner', m, conn);
        throw false;
      }
      bot.autoread2 = isEnable;
      //global.opts['autoread'] = isEnable;
      break;
    case 'pconly':
    case 'privateonly':
      isAll = true;
      if (!isROwner) {
        global.dfail('rowner', m, conn);
        throw false;
      }
      global.opts['pconly'] = isEnable;
      break;
    case 'gconly':
    case 'grouponly':
      isAll = true;
      if (!isROwner) {
        global.dfail('rowner', m, conn);
        throw false;
      }
      global.opts['gconly'] = isEnable;
      break;
    case 'swonly':
    case 'statusonly':
      isAll = true;
      if (!isROwner) {
        global.dfail('rowner', m, conn);
        throw false;
      }
      global.opts['swonly'] = isEnable;
      break;
    case 'anticall':
      isAll = true;
      if (!(isROwner || isOwner)) {
        global.dfail('owner', m, conn);
        throw false;
      }
      bot.antiCall = isEnable;
      break;
    case 'antiprivado':
      isAll = true;
      if (!(isROwner || isOwner)) {
        global.dfail('owner', m, conn);
        throw false;
      }
      bot.antiPrivate = isEnable;
      break;
    case 'modejadibot':
      isAll = true;
      if (!isROwner) {
        global.dfail('rowner', m, conn);
        throw false;
      }
      bot.modejadibot = isEnable;
      break;
    case 'antispam':
      isAll = true;
      if (!(isROwner || isOwner)) {
        global.dfail('owner', m, conn);
        throw false;
      }
      bot.antispam = isEnable;
      break;
    case 'antitoxic':
      if (m.isGroup) {
        if (!(isAdmin || isROwner || isOwner)) {
          global.dfail('admin', m, conn);
          throw false;
        }
      }
      chat.antiToxic = isEnable;
      break;
      case 'game': case 'juegos': case 'fun': case 'ruleta':
if (m.isGroup) {
if (!(isAdmin || isOwner)) {
global.dfail('admin', m, conn)
throw false
}}
chat.game = isEnable          
break;
    case 'antitraba':
      if (m.isGroup) {
        if (!(isAdmin || isROwner || isOwner)) {
          global.dfail('admin', m, conn);
          throw false;
        }
      }
      chat.antiTraba = isEnable;
      break;
    case 'antiarabes':
      if (m.isGroup) {
        if (!(isAdmin || isROwner || isOwner)) {
          global.dfail('admin', m, conn); 
          throw false;
        }
      }
      chat.antiArab = isEnable;
      break;
    case 'antiarabes2':
      if (m.isGroup) {
        if (!(isAdmin || isROwner || isOwner)) {
          global.dfail('admin', m, conn);
          throw false;
        }
      }
      chat.antiArab2 = isEnable;
      break;
    default:
      if (!/[01]/.test(command)) return await conn.sendMessage(m.chat, {text: optionsFull}, {quoted: m});
      throw false;
  }
  conn.sendMessage(m.chat, {text: `_*${tradutor.text27[0]}*_\n\n*${tradutor.text27[1]}* _${type}_ *was* ${isEnable ? '_enabled_' : '_disabled_'} *${tradutor.text27[2]}* ${isAll ? '_for the bot._' : isUser ? '' : '_for this chat._'}`}, {quoted: m});
};
handler.command = /^((en|dis)able|(tru|fals)e|(turn)?[01])$/i;
export default handler;
