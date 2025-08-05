let crimePenalty = 500;
let diamondPenalty = 10;

const handler = async (m, { conn, usedPrefix, command, groupMetadata, participants, isPrems }) => {
  const datas = global;
  const language = datas.db.data.users[m.sender].language || global.defaultLanguage;
  const _translate = JSON.parse(fs.readFileSync(`./src/languages/${language}.json`));
  const translator = _translate.plugins.rpg_crime;

  global.robSuccess = translator.texto4; // Success messages
  global.robFail = translator.texto5;    // Failure messages

  // 1 hour cooldown (3600000 ms)
  const cooldownEnd = global.db.data.users[m.sender].crime + 3600000;
  if (new Date() - global.db.data.users[m.sender].crime < 3600000) {
    return m.reply(`${translator.texto1} ${msToTime(cooldownEnd - new Date())}`);
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
        return m.reply(`《💰》${pickRandom(global.robSuccess)} ${exp} XP`)
          .then(() => global.db.data.users[m.sender].exp += exp);
        
      case 'fail_penalty':
        return m.reply(`《🚓》${pickRandom(global.robFail)} ${exp} XP`)
          .then(() => global.db.data.users[m.sender].exp -= crimePenalty);
        
      case 'success_money':
        return m.reply(`《💰》*${pickRandom(global.robSuccess)}*\n\n${diamond} ${translator.texto2[0]}\n${money} ${translator.texto2[1]}`)
          .then(() => {
            global.db.data.users[m.sender].limit += diamond;
            global.db.data.users[m.sender].money += money;
          });
        
      case 'fail_money':
        return m.reply(`《🚓》${pickRandom(global.robFail)}\n\n${diamond} ${translator.texto2[0]}\n${money} ${translator.texto2[1]}`)
          .then(() => {
            global.db.data.users[m.sender].limit -= diamondPenalty;
            global.db.data.users[m.sender].money -= crimePenalty;
          });
        
      case 'success_target':
        return conn.reply(m.chat, 
          `${translator.texto3[0]} @${randomTarget.split`@`[0]} ${translator.texto3[1]} ${exp} XP`, 
          m, 
          { contextInfo: { mentionedJid: [randomTarget] } }
        ).then(() => {
          global.db.data.users[m.sender].exp += exp;
          global.db.data.users[randomTarget].exp -= crimePenalty;
        });
    }
  } catch (e) {
    console.error('Crime command error:', e);
  }
};

handler.help = ['crime'];
handler.tags = ['rpg'];
handler.command = /^(crime|Crime)$/i;
handler.register = true;
handler.group = true;
export default handler;

function msToTime(duration) {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  
  return `${hours} Hour(s) ${minutes} Minute(s) ${seconds} Second(s)`;
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}