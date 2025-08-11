const handler = async (m, {conn, participants, groupMetadata}) => {
  const datas = global
  const idioma = datas.db.data.users[m.sender].language || global.defaultLenguaje
  const _translate = JSON.parse(fs.readFileSync(`./src/languages/${idioma}.json`))
  const tradutor = _translate.plugins.gc_infogroup

  const pp = await conn.profilePictureUrl(m.chat, 'image') || imagen1 ||'./src/avatar_contact.png';
  const {antiToxic, antiTraba, antidelete, antiviewonce, isBanned, welcome, detect, detect2, sWelcome, sBye, sPromote, sDemote, antiLink, antiLink2, modohorny, autosticker, modoadmin, audios, delete: del} = global.db.data.chats[m.chat];
  const groupAdmins = participants.filter((p) => p.admin);
  const listAdmin = groupAdmins.map((v, i) => `${i + 1}. @${v.id.split('@')[0]}`).join('\n');
  const owner = groupMetadata.ownerJid || groupMetadata.owner
  const text = `${tradutor.text1[0]}\n
  ${tradutor.text1[1]}* 
${groupMetadata.id}

${tradutor.text1[2]}
${groupMetadata.subject}

${tradutor.text1[3]} 
${groupMetadata.desc?.toString() || tradutor.text1[22]}


${tradutor.text1[4]} 
${participants.length} ${tradutor.text1[5]} 

${tradutor.text1[6]}  
@${owner.split('@')[0]}

${tradutor.text1[7]}  
${listAdmin}

${tradutor.text1[8]} 
${tradutor.text1[9]}  ${welcome ? '✅' : '❌'}
${tradutor.text1[10]}  ${detect ? '✅' : '❌'} 
${tradutor.text1[11]}  ${detect2 ? '✅' : '❌'} 
${tradutor.text1[12]}  ${antiLink ? '✅' : '❌'} 
${tradutor.text1[13]}  ${antiLink2 ? '✅' : '❌'} 
${tradutor.text1[14]}  ${modohorny ? '✅' : '❌'} 
${tradutor.text1[15]}  ${autosticker ? '✅' : '❌'} 
${tradutor.text1[16]}  ${audios ? '✅' : '❌'} 
${tradutor.text1[17]}  ${antiviewonce ? '✅' : '❌'} 
${tradutor.text1[18]}  ${antidelete ? '✅' : '❌'} 
${tradutor.text1[19]}  ${antiToxic ? '✅' : '❌'} 
${tradutor.text1[20]}  ${antiTraba ? '✅' : '❌'} 
${tradutor.text1[21]}  ${modoadmin ? '✅' : '❌'} 
`.trim();
  conn.sendFile(m.chat, pp, 'error.jpg', text, m, false, {mentions: [...groupAdmins.map((v) => v.id), owner]});
};
handler.help = ['infogrup'];
handler.tags = ['group'];
handler.command = /^(infogrupo|gro?upinfo|info(gro?up|gc))$/i;
handler.group = true;
export default handler;