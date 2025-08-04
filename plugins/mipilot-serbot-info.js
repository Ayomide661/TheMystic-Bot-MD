import ws from 'ws';

async function handler(m, { conn: _envio, usedPrefix }) {
  const datas = global;
  const language = datas.db.data.users[m.sender].language || global.defaultLanguage;
  const _translate = JSON.parse(fs.readFileSync(`./src/languages/${language}.json`));
  const translator = _translate.plugins.mipilot_serbot_info;

  const users = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => conn)])];
  
  function convertMsToDaysHoursMinutesSeconds(ms) {
    let seconds = Math.floor(ms / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);

    seconds %= 60;
    minutes %= 60;
    hours %= 24;

    let result = "";
    if (days !== 0) {
      result += days + translator.texto3[0]; // days unit
    }
    if (hours !== 0) {
      result += hours + translator.texto3[1]; // hours unit
    }
    if (minutes !== 0) {
      result += minutes + translator.texto3[2]; // minutes unit
    }
    if (seconds !== 0) {
      result += seconds + translator.texto3[3]; // seconds unit
    }

    return result || "0" + translator.texto3[3]; // default to 0 seconds if empty
  }

  const message = users.map((v, index) => 
    `*${index + 1}.-* @${v.user.jid.replace(/[^0-9]/g, '')}\n` +
    `${translator.texto4[0]} wa.me/${v.user.jid.replace(/[^0-9]/g, '')}?text=${usedPrefix}status\n` +
    `${translator.texto4[1]} ${v.user.name || '-'}\n` +
    `${translator.texto4[2]} ${v.uptime ? convertMsToDaysHoursMinutesSeconds(Date.now() - v.uptime) : "Unknown"}`
  ).join('\n\n');

  const replyMessage = message.length === 0 ? translator.texto1 : message;
  const totalUsers = users.length;
  
  const responseMessage = `
${translator.texto2[0]}

${translator.texto2[1]}

${translator.texto2[2]}

${translator.texto2[3]} ${totalUsers || '0'}

${replyMessage.trim()}`.trim();

  await _envio.sendMessage(m.chat, {
    text: responseMessage, 
    mentions: _envio.parseMention(responseMessage)
  }, {quoted: m});
}

handler.command = handler.help = ['listjadibot', 'bots', 'subsbots'];
handler.tags = ['jadibot'];
export default handler;