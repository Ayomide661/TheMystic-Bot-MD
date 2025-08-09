import fs from 'fs';

const handler = async (m, { args, usedPrefix, command }) => {
  // Debug: Log command trigger
  console.log("Slot command triggered by:", m.sender);

  const datas = global;
  const idioma = datas.db?.data?.users[m.sender]?.language || global.defaultLenguaje || 'en';
  
  // Load language file with error handling
  let _translate;
  try {
    _translate = JSON.parse(fs.readFileSync(`./src/languages/${idioma}.json`));
  } catch (e) {
    console.error("Language file error:", e);
    _translate = { plugins: { game_slot: { 
      text1: "Usage: slot <amount>", 
      text2: "Example:", 
      text3: ["Wait", "before playing again!"], 
      text4: "Minimum bet: 100 XP", 
      text5: "Not enough XP!", 
      text6: "JACKPOT! You won", 
      text7: "Small win!", 
      text8: "You lost" 
    } } };
  }
  const tradutor = _translate.plugins.game_slot;

  const fa = `${tradutor.text1}\n\n${tradutor.text2}\n*${usedPrefix + command} 100*`;
  if (!args[0]) throw fa;
  if (isNaN(args[0])) throw fa;

  const apuesta = parseInt(args[0]);
  const users = global.db?.data?.users[m.sender];
  if (!users) throw "User data not loaded!";

  const time = users.lastslot + 10000;
  if (new Date() - users.lastslot < 10000) throw `${tradutor.text3[0]} ${msToTime(time - new Date())} ${tradutor.text3[1]}`;
  if (apuesta < 100) throw tradutor.text4;
  if (users.exp < apuesta) throw tradutor.text5;

  const emojis = ['🐋', '🐉', '🕊️', '🍎', '🍒', '🍇'];
  const a = Math.floor(Math.random() * emojis.length);
  const b = Math.floor(Math.random() * emojis.length);
  const c = Math.floor(Math.random() * emojis.length);

  const slots = [
    [emojis[a], emojis[b], emojis[c]],
    [emojis[(a + 1) % emojis.length], emojis[(b + 2) % emojis.length], emojis[(c + 3) % emojis.length]],
    [emojis[(a + 2) % emojis.length], emojis[(b + 1) % emojis.length], emojis[(c + 4) % emojis.length]]
  ];

  let end;
  if (a === b && b === c) {
    const win = apuesta * 5;
    end = `${tradutor.text6} +${win} XP 🎉*`;
    users.exp += win;
  } else if (a === b || a === c || b === c) {
    const win = Math.floor(apuesta * 1.5);
    end = `${tradutor.text7} +${win} XP!*`;
    users.exp += win;
  } else {
    end = `${tradutor.text8} -${apuesta} XP*`;
    users.exp -= apuesta;
  }

  users.lastslot = new Date();
  await m.reply(
    `🎰 | *SLOTS*\n────────\n` +
    `${slots[0].join(' : ')}\n` +
    `${slots[1].join(' : ')}\n` +
    `${slots[2].join(' : ')}\n` +
    `────────\n🎰 | ${end}`
  ).catch(e => console.error("Reply failed:", e));
};

handler.help = ['slot <amount>'];
handler.tags = ['game'];
handler.command = ['slot', 'slots'];
export default handler;

function msToTime(duration) {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  return `${minutes}m ${seconds}s`;
}