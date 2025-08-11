import fs from 'fs';

const handler = async (m, { conn, usedPrefix }) => {
  const datas = global;
  const language = datas.db.data.users[m.sender].language || global.defaultLenguaje;
  const _translate = JSON.parse(fs.readFileSync(`./src/languages/${language}.json`));
  const translator = _translate.plugins.info_groupsofc;

  const doc = ['pdf', 'zip', 'vnd.openxmlformats-officedocument.presentationml.presentation', 'vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const document = doc[Math.floor(Math.random() * doc.length)];
  const text = `${translator.text1[0]}
  
${translator.text1[1]}
  
> Sunlight Team:
  `.trim();
  
  const buttonMessage = {
    'document': { url: 'https://github.com/Ayomide661/TheMystic-Bot-MD' },
    'mimetype': `application/${document}`,
    'fileName': `${translator.text2}`,
    'fileLength': 99999999999999,
    'pageCount': 200,
    'contextInfo': {
      'forwardingScore': 200,
      'isForwarded': true,
      'externalAdReply': {
        'mediaUrl': 'https://github.com/Ayomide661/TheMystic-Bot-MD',
        'mediaType': 2,
        'previewType': 'pdf',
        'title': `${translator.text3}`,
        'body': wm,
        'thumbnail': imagen1,
        'sourceUrl': 'https://www.youtube.com/channel/UCSTDMKjbm-EmEovkygX-lCA'
      }
    },
    'caption': text,
    'footer': wm,
    'headerType': 6
  };
  
  conn.sendMessage(m.chat, buttonMessage, { quoted: m });
};

handler.command = ['linkgc', 'grupos'];
export default handler;
