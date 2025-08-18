const handler = async (m, {conn, args, groupMetadata, participants, usedPrefix, command, isBotAdmin, isSuperAdmin}) => {
  const datas = global
  const idioma = datas.db.data.users[m.sender].language || global.defaultLenguaje
  const _translate = JSON.parse(fs.readFileSync(`./src/languages/${idioma}.json`))
  const tradutor = _translate.plugins.gc_listanum_kicknum

  if (!args[0]) return m.reply(`${tradutor.text1} ${usedPrefix + command} 52*`);
  if (isNaN(args[0])) return m.reply(`${tradutor.text2} ${usedPrefix + command} 52*`);
  
  const lol = args[0].replace(/[+]/g, '');
  const ps = participants.map((u) => u.id).filter((v) => v !== conn.user.jid && v.split('@')[0].startsWith(lol));
  const bot = global.db.data.settings[conn.user.jid] || {};
  
  if (ps.length === 0) return m.reply(`${tradutor.text3} +${lol}*`);
  
  const numeros = ps.map((v) => '⭔ @' + v.split('@')[0]);
  const delay = (time) => new Promise((res) => setTimeout(res, time));
  
  switch (command) {
    case 'listanum': case 'listnum':
      conn.reply(m.chat, `${tradutor.text4[0]} +${lol} ${tradutor.text4[1]}\n\n` + numeros.join`\n`, m, {mentions: ps});
      break;
      
    case 'kicknum':
      if (!bot.restrict) return m.reply(`${tradutor.text5[0]} (#𝚎𝚗𝚊𝚋𝚕𝚎 𝚛𝚎𝚜𝚝𝚛𝚒𝚌𝚝) ${tradutor.text5[1]}`);
      if (!isBotAdmin) return m.reply(tradutor.text6);
      
      conn.reply(m.chat, `${tradutor.text7[0]} +${lol}, ${tradutor.text7[1]}`, m);
      
      const ownerGroup = m.chat.split('-')[0] + '@s.whatsapp.net';
      
      for (const user of ps) {
        try {
          if (user !== ownerGroup && 
              user !== conn.user.jid && 
              !global.owner.includes(user.split('@')[0])) {
            
            await delay(2000);
            await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
            await delay(10000);
          }
        } catch (error) {
          console.error(`Error kicking ${user}:`, error);
          m.reply(`Failed to kick @${user.split('@')[0]}`, null, {mentions: [user]});
        }
      }
      break;
  }
};

handler.tags = ['group'];
handler.help = ['kicknum', 'listnum'];
handler.command = /^(listanum|kicknum|listnum)$/i;
handler.group = handler.botAdmin = handler.admin = true;
handler.fail = null;
export default handler;