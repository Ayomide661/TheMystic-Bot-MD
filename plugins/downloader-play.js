import yts from 'yt-search';

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
  const datas = global;
  const idioma = datas.db.data.users[m.sender].language || global.defaultLenguaje;
  const _translate = JSON.parse(fs.readFileSync(`./src/languages/${idioma}.json`));
  const tradutor = _translate.plugins.descargas_play;

  if (!text) throw `${tradutor.text1[0]} ${usedPrefix + command} ${tradutor.text1[1]}`;
  
  let additionalText = '';
  if (['play'].includes(command)) {
    additionalText = 'audio';
  } else if (['play2'].includes(command)) {
    additionalText = 'video';
  }

  const regex = "https://youtube.com/watch?v=";
  const result = await search(args.join(' '));
  const body = `${tradutor.text2[0]} ${result.title}\n${tradutor.text2[1]} ${result.ago}\n${tradutor.text2[2]} ${result.duration.timestamp}\n${tradutor.text2[3]} ${formatNumber(result.views)}\n${tradutor.text2[4]} ${result.author.name}\n${tradutor.text2[5]} ${result.videoId}\n${tradutor.text2[6]} ${result.type}\n${tradutor.text2[7]} ${result.url}\n${tradutor.text2[8]} ${result.author.url}\n\n${tradutor.text2[9]} ${additionalText}, ${tradutor.text2[10]}`.trim();
  
  conn.sendMessage(m.chat, { image: { url: result.thumbnail }, caption: body }, { quoted: m });

  if (command === 'play') {
    try {
      const audiodlp = await tools.downloader.ytmp3(regex + result.videoId);
      const downloader = audiodlp.download;
      conn.sendMessage(m.chat, { audio: { url: downloader }, mimetype: "audio/mpeg" }, { quoted: m });
    } catch (error) {
      console.log(error);
      conn.reply(m.chat, tradutor.text6, m);
    }
  }

  if (command === 'play2') {
    try {
      const videodlp = await tools.downloader.ytmp4(regex + result.videoId);
      const downloader = videodlp.download;
      conn.sendMessage(m.chat, { video: { url: downloader }, mimetype: "video/mp4" }, { quoted: m });
    } catch (error) {
      console.log(error);
      conn.reply(m.chat, tradutor.text6, m);
    }
  }
};

handler.help = ['play', 'play2'];
handler.tags = ['downloader'];
//handler.command = ['play', 'play2'];

export default handler;

async function search(query, options = {}) {
  const search = await yts.search({query, hl: 'en', gl: 'US', ...options});
  return search.videos[0];
}

function formatNumber(num) {
  return num.toLocaleString();
}