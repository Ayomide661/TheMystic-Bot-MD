import { performance } from "perf_hooks";

const handler = async (m, { conn, usedPrefix }) => {
  const old = performance.now(); // Start measuring response time here

  const _uptime = process.uptime() * 1000;
  const uptime = clockString(_uptime);
  const totalusrReg = Object.values(global.db.data.users).filter((user) => user.registered == true).length;
  const totalusr = Object.keys(global.db.data.users).length;
  const chats = Object.entries(conn.chats).filter(([id, data]) => id && data.isChats);
  const groups = chats.filter(([id]) => id.endsWith("@g.us"));
  const { restrict, anticall, antiprivate, jadibotmode } = global.db.data.settings[conn.user.jid] || {};
  const { autoread, gconly, pconly, self } = global.opts || {};

  const neww = performance.now(); // Stop measuring response time here
  const rtime = (neww - old).toFixed(7);

  const info = `🤖 *BOT STATUS* 🤖

👤 *Owner:* Ayomide661
📞 *Contact:* +2348108629978
💳 *Donations:* Not available

⚡ *Response Speed:* ${rtime} seconds
⏱️ *Uptime:* ${uptime}
🔧 *Prefix:* ${usedPrefix}
🌐 *Mode:* ${self ? "private" : "public"}
📝 *Registered Users:* ${totalusrReg}
👥 *Total Users:* ${totalusr}
🤖 *Bot Type:* ${(conn.user.jid == global.conn.user.jid ? 'Main bot' : `Sub-bot of: +${global.conn.user.jid.split`@`[0]}`)}

📩 *Private Chats:* ${chats.length - groups.length}
👥 *Groups:* ${groups.length}
💬 *Total Chats:* ${chats.length}

🔔 *Auto Read:* ${autoread ? "✅ on" : "❌ off"}
🚫 *Restrict Mode:* ${restrict ? "✅ on" : "❌ off"}
💻 *PC Only:* ${pconly ? "✅ on" : "❌ off"}
👥 *GC Only:* ${gconly ? "✅ on" : "❌ off"}
🚷 *Anti Private:* ${antiprivate ? "✅ on" : "❌ off"}
📵 *Anti Call:* ${anticall ? "✅ on" : "❌ off"}
🤖 *Bot Mode:* ${modejadibot ? "✅ on" : "❌ off"}`;

  await conn.sendMessage(m.chat, { text: info }, { quoted: m });
};

handler.command = /^(ping|info|status|estado|infobot)$/i;
export default handler;

function clockString(ms) {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor(ms / 60000) % 60;
  const s = Math.floor(ms / 1000) % 60;
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':');
}
