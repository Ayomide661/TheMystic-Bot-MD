import { prepareWAMessageMedia, generateWAMessageFromContent, getDevice } from "baileys"
import yts from 'yt-search';
import fs from 'fs';

const handler = async (m, { conn, text, usedPrefix: prefix }) => {
    const datas = global;
    const language = datas.db.data.users[m.sender].language || global.defaultLanguage;
    const _translate = JSON.parse(fs.readFileSync(`./src/languages/${language}.json`));
    const traductor = _translate.plugins.search_yts;
    const device = await getDevice(m.key.id);

  if (!text) throw `⚠️ *${traductor.text1}*`;

  if (device !== 'desktop' || device !== 'web') {      

  const results = await yts(text);
  if (!results || !results?.videos) return m.reply('> *[❗] Error: Videos not found.*')    
  const videos = results.videos.slice(0, 20);
  const randomIndex = Math.floor(Math.random() * videos.length);
  const randomVideo = videos[randomIndex];

  var messa = await prepareWAMessageMedia({ image: {url: randomVideo.thumbnail}}, { upload: conn.waUploadToServer })
  const interactiveMessage = {
    body: { text: `*—◉ Search results:* ${results.videos.length}\n*—◉ Random video:*\n*-› Title:* ${randomVideo.title}\n*-› Author:* ${randomVideo.author.name}\n*-› Views:* ${randomVideo.views}\n*-› ${traductor.text2[0]}:* ${randomVideo.url}\n*-› Thumbnail:* ${randomVideo.thumbnail}`.trim() },
    footer: { text: `${global.wm}`.trim() },  
      header: {
          title: `*< YouTube Search />*\n`,
          hasMediaAttachment: true,
          imageMessage: messa.imageMessage,
      },
    nativeFlowMessage: {
      buttons: [
        {
          name: 'single_select',
          buttonParamsJson: JSON.stringify({
            title: 'AVAILABLE OPTIONS',
            sections: videos.map((video) => ({
              title: video.title,
              rows: [
                {
                  header: video.title,
                  title: video.author.name,
                  description: 'Download MP3',
                  id: `${prefix}ytmp3 ${video.url}`
                },
                {
                  header: video.title,
                  title: video.author.name,
                  description: 'Download MP4',
                  id: `${prefix}ytmp4 ${video.url}`
                }
              ]
            }))
          })
        }
      ],
      messageParamsJson: ''
    }
  };        

        let msg = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    interactiveMessage,
                },
            },
        }, { userJid: conn.user.jid, quoted: m })
      conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id});

  } else {
  const datas = global;
  const language = datas.db.data.users[m.sender].language || global.defaultLanguage;
  const _translate = JSON.parse(fs.readFileSync(`./src/languages/${language}.json`));
  const traductor = _translate.plugins.search_yts;      
  const results = await yts(text);
  const tes = results.all;
  const teks = results.all.map((v) => {
    switch (v.type) {
      case 'video': return `
° *_${v.title}_*
↳ 🫐 *_${traductor.text2[0]}_* ${v.url}
↳ 🕒 *_${traductor.text2[1]}_* ${v.timestamp}
↳ 📥 *_${traductor.text2[2]}_* ${v.ago}
↳ 👁 *_${traductor.text2[3]}_* ${v.views}`;
    }
  }).filter((v) => v).join('\n\n◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦\n\n');
  conn.sendFile(m.chat, tes[0].thumbnail, 'error.jpg', teks.trim(), m);      
  }    
};
handler.help = ['ytsearch <text>'];
handler.tags = ['search'];
handler.command = /^(ytsearch|yts|searchyt|ytsearch|videosearch|audiosearch)$/i;
export default handler;