let crimePenalty = 500;
let diamondPenalty = 10;

const handler = async (m, { conn, usedPrefix, command, groupMetadata, participants, isPrems }) => {
  const datas = global;
  const language = datas.db.data.users[m.sender].language || global.defaultLanguage;
  const _translate = JSON.parse(fs.readFileSync(`./src/languages/${language}.json`));
  const translator = _translate.plugins.rpg_crime;

  // Safety check before attempting crime
  if (global.db.data.users[m.sender].limit < diamondPenalty) {
    return m.reply(`🚷 ${translator.antiCheat || "You don't have enough diamonds to risk this crime!"}\n` +
                 `Your balance: ${global.db.data.users[m.sender].limit} 💎\n` +
                 `Required safety deposit: ${diamondPenalty} 💎`);
  }

  // 1 hour cooldown (3600000 ms)
  const cooldownEnd = global.db.data.users[m.sender].crime + 3600000;
  if (new Date() - global.db.data.users[m.sender].crime < 3600000) {
    return m.reply(`${translator.texto1 || "⏳ Cooldown active! Try again in:"} ` + 
                 `${msToTime(cooldownEnd - new Date())}`);
  }

  let target;
  if (m.isGroup) {
    target = m.mentionedJid[0] 
      ? m.mentionedJid[0] 
      : m.quoted 
        ? m.quoted.sender 
        : false;
  } else {
    target = m.chat;
  }

  try {
    let participantIds = groupMetadata.participants.map(v => v.id);
    let randomTarget = participantIds.getRandom();
    let targetUser = global.db.data.users[randomTarget];
    
    const exp = Math.floor(Math.random() * 9000);
    const diamond = Math.floor(Math.random() * 150);
    const money = Math.floor(Math.random() * 9000);
    
    let outcomes = ['success_no_loot', 'fail_penalty', 'success_money', 'fail_money', 'success_target'];
    let outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
    
    global.db.data.users[m.sender].crime = new Date() * 1;

    switch(outcome) {
      case 'success_no_loot':
        global.db.data.users[m.sender].exp += exp;
        return m.reply(`💰 ${pickRandom(global.robSuccess || ["Crime successful!"])} +${exp} XP`);
        
      case 'fail_penalty':
        global.db.data.users[m.sender].exp = Math.max(0, global.db.data.users[m.sender].exp - crimePenalty);
        return m.reply(`🚓 ${pickRandom(global.robFail || ["Crime failed!"])} -${Math.min(crimePenalty, global.db.data.users[m.sender].exp)} XP`);
        
      case 'success_money':
        global.db.data.users[m.sender].limit += diamond;
        global.db.data.users[m.sender].money += money;
        return m.reply(`💰 *${pickRandom(global.robSuccess || ["Big score!"]}*\n\n` +
                     `+${diamond} ${translator.texto2?.[0] || "💎 Diamonds"}\n` +
                     `+${money} ${translator.texto2?.[1] || "💰 Money"}`);
        
      case 'fail_money':
        const diamondsLost = Math.min(diamondPenalty, global.db.data.users[m.sender].limit);
        const moneyLost = Math.min(crimePenalty, global.db.data.users[m.sender].money);
        
        global.db.data.users[m.sender].limit -= diamondsLost;
        global.db.data.users[m.sender].money -= moneyLost;
        
        return m.reply(`🚓 ${pickRandom(global.robFail || ["Caught red-handed!"]}\n\n` +
                     `-${diamondsLost} ${translator.texto2?.[0] || "💎 Diamonds"}\n` +
                     `-${moneyLost} ${translator.texto2?.[1] || "💰 Money"}`);
        
      case 'success_target':
        const stolenExp = Math.min(crimePenalty, global.db.data.users[randomTarget].exp);
        global.db.data.users[m.sender].exp += stolenExp;
        global.db.data.users[randomTarget].exp -= stolenExp;
        
        return conn.reply(m.chat, 
          `${translator.texto3?.[0] || "Stole"} @${randomTarget.split`@`[0]} ` +
          `${translator.texto3?.[1] || "and gained"} ${stolenExp} XP`, 
          m, 
          { contextInfo: { mentionedJid: [randomTarget] } }
        );
    }
  } catch (e) {
    console.error('Crime System Error:', e);
    return m.reply(translator.error || "❌ Crime failed unexpectedly!");
  }
};

handler.help = ['crime'];
handler.tags = ['rpg'];
handler.command = /^(crime|rob|steal)$/i;
handler.register = true;
handler.group = true;
export default handler;

function msToTime(duration) {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  return `${hours}h ${minutes}m ${seconds}s`;
}

function pickRandom(list) {
  return list?.[Math.floor(Math.random() * list.length)] || "Default crime message";
}