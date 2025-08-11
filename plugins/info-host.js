

const handler = async (m, {conn, usedPrefix}) => {
  const datas = global
  const idioma = datas.db.data.users[m.sender].language || global.defaultLenguaje
  const _translate = JSON.parse(fs.readFileSync(`./src/languages/${idioma}.json`))
  const tradutor = _translate.plugins.info_host

  const doc = ['pdf', 'zip', 'vnd.openxmlformats-officedocument.presentationml.presentation', 'vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const document = doc[Math.floor(Math.random() * doc.length)];
  const text = `${tradutor.text1[0]}
  
${tradutor.text1[1]}

${tradutor.text1[2]}

${tradutor.text1[3]}
${tradutor.text1[4]}

${tradutor.text1[5]}
${tradutor.text1[6]}

${tradutor.text1[7]}
${tradutor.text1[8]}

${tradutor.text1[9]}
${tradutor.text1[10]}

${tradutor.text1[11]}
${tradutor.text1[12]}

${tradutor.text1[13]}
${tradutor.text1[14]}

${tradutor.text1[15]}
${tradutor.text1[16]}
`.trim();
  const buttonMessage= {
    'document': {url: `https://github.com/Ayomide661/TheMystic-Bot-MD`},
    'mimetype': `application/${document}`,
    'fileName': `「  𝑯𝒆𝒍𝒍𝒐 𝑾𝒐𝒓𝒍𝒅 」`,
    'fileLength': 99999999999999,
    'pageCount': 200,
    'contextInfo': {
      'forwardingScore': 200,
      'isForwarded': true,
      'externalAdReply': {
        'mediaUrl': 'https://github.com/Ayomide661/TheMystic-Bot-MD',
        'mediaType': 2,
        'previewType': 'pdf',
        'title': tradutor.text2,
        'body': wm,
        'thumbnail': imagen1,
        'sourceUrl': 'https://chat.whatsapp.com/CwG9Gp6dF2H6bWgld00lF1?mode=ac_t'}},
    'caption': text,
    'footer': wm,
    // 'buttons':[
    // {buttonId: `${usedPrefix}menu`, buttonText: {displayText: '𝙼𝙴𝙽𝚄'}, type: 1},
    // {buttonId: `${usedPrefix}donar`, buttonText: {displayText: '𝙳𝙾𝙽𝙰𝚁'}, type: 1}],
    'headerType': 6};
  conn.sendMessage(m.chat, buttonMessage, {quoted: m});
}; 
handler.command = ['host', 'cafirexos'];
export default handler;
