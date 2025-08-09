import { generateWAMessageFromContent } from "baileys";
import os from "os";
import util from "util";
import sizeFormatter from "human-readable";
import MessageType from "baileys";
import fs from "fs";
import { performance } from "perf_hooks";

const handler = async (m, { conn, usedPrefix }) => {
  const datas = global
  const idioma = datas.db.data.users[m.sender].language || global.defaultLenguaje
  const _translate = JSON.parse(fs.readFileSync(`./src/languages/${idioma}.json`))
  const tradutor = _translate.plugins.info_estado

  const _uptime = process.uptime() * 1000;
  const uptime = clockString(_uptime);
  const totalusrReg = Object.values(global.db.data.users).filter((user) => user.registered == true).length;
  const totalusr = Object.keys(global.db.data.users).length;
  const chats = Object.entries(conn.chats).filter(
    ([id, data]) => id && data.isChats,
  );
  const groupsIn = chats.filter(([id]) => id.endsWith("@g.us"));
  const groups = chats.filter(([id]) => id.endsWith("@g.us"));
  const used = process.memoryUsage();
  const { restrict, antiCall, antiprivado, modejadibot } =
    global.db.data.settings[conn.user.jid] || {};
  const { autoread, gconly, pconly, self } = global.opts || {};
  const old = performance.now();
  const neww = performance.now();
  const rtime = (neww - old).toFixed(7);
  const wm = 'The Mystic Bot';
  const info = ` ${tradutor.text1[0]}

  ${tradutor.text1[1]} Ayomide661
  ${tradutor.text1[2]} +2348108629978
  ${tradutor.text1[3]} I/don't/have/PayPal

  ${tradutor.text1[4]} ${rtime}
  ${tradutor.text1[5]} ${uptime}
  ${tradutor.text1[6]} ${usedPrefix}
  ${tradutor.text1[7]} ${self ? "privado" : "público"}
  ${tradutor.text1[8]} ${totalusrReg}
  ${tradutor.text1[9]} ${totalusr}
  ${tradutor.text1[10]} ${(conn.user.jid == global.conn.user.jid ? '' : `Sub-bot de:\n ▢ +${global.conn.user.jid.split`@`[0]}`) || 'No es sub-bot'}
 
  ${tradutor.text1[11]} ${chats.length - groups.length}
  ${tradutor.text1[12]} ${groups.length}
  ${tradutor.text1[13]} ${chats.length}
 
  ${tradutor.text1[14]} ${autoread ? "activo" : "desactivado"}
  ${tradutor.text1[15]} ${restrict ? "activo" : "desactivado"}
  ${tradutor.text1[16]} ${pconly ? "activado" : "desactivado"}
  ${tradutor.text1[17]} ${gconly ? "activado" : "desactivado"}
  ${tradutor.text1[18]} ${antiprivado ? "activado" : "desactivado"}
  ${tradutor.text1[19]} ${antiCall ? "activado" : "desactivado"}
  ${tradutor.text1[20]} ${modejadibot ? "activado" : "desactivado"}`.trim();
  const doc = [
    "pdf",
    "zip",
    "vnd.openxmlformats-officedocument.presentationml.presentation",
    "vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  const document = doc[Math.floor(Math.random() * doc.length)];
  const Message = {
    document: { url: `https://github.com/Ayomide661/TheMystic-Bot-MD` },
    mimetype: `application/${document}`,
    fileName: `Documento`,
    fileLength: 99999999999999,
    pageCount: 200,
    contextInfo: {
      forwardingScore: 200,
      isForwarded: true,
      externalAdReply: {
        mediaUrl: "https://github.com/Ayomide661/TheMystic-Bot-MD",
        mediaType: 2,
        previewType: "pdf",
        title: "The Mystic - Bot",
        body: tradutor.text2,
        thumbnail: imagen1,
        sourceUrl: "https://github.com/Ayomide661/TheMystic-Bot-MD",
      },
    },
    caption: info,
    footer: wm,
    headerType: 6,
  };
  conn.sendMessage(m.chat, Message, { quoted: m });
};

handler.command = /^(ping|info|status|estado|infobot)$/i;
export default handler;

function clockString(ms) {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor(ms / 60000) % 60;
  const s = Math.floor(ms / 1000) % 60;
  console.log({ ms, h, m, s });
  return [h, m, s].map((v) => v.toString().padStart(2, 0)).join(":");
}
