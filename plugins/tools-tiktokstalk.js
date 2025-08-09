import axios from 'axios';
import fs from 'fs';

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const handler = async (m, { conn, text }) => {
  const datas = global;
  const idioma = datas.db.data.users[m.sender].language || global.defaultLenguaje;
  const _translate = JSON.parse(fs.readFileSync(`./src/languages/${idioma}.json`));
  const tradutor = _translate.plugins.downloader_tiktokstalk;

  if (!text) return conn.reply(m.chat, tradutor.text1, m);  
  try {
    const response = await axios.get("https://delirius-apiofc.vercel.app/tools/tiktokstalk", {
      params: { q: text }
    });

    const data = response.data;
    if (data.status && data.result) {
      const user = data.result.users;
      const stats = data.result.stats;
      const body = `${tradutor.text2[0]} ${user.username || '-'}\n${tradutor.text2[1]} ${user.nickname || '-'}\n${tradutor.text2[2]} ${stats.followerCount ? formatNumber(stats.followerCount) : '-'}\n${tradutor.text2[3]} ${stats.followingCount ? formatNumber(stats.followingCount) : '-'}\n${tradutor.text2[4]} ${stats.likeCount ? formatNumber(stats.likeCount) : '-'}\n${tradutor.text2[5]} ${stats.videoCount ? formatNumber(stats.videoCount) : '-'}\n${tradutor.text2[6]} ${user.signature || '-'}`.trim();
      const imageUrl = user.avatarLarger;
      const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(imageResponse.data, "binary");

      await conn.sendFile(m.chat, imageBuffer, 'profile.jpg', body, m);
    } else {
      throw tradutor.text3; 
    }
  } catch (e) {
    throw tradutor.text3;  
  }
};

handler.help = ['tiktokstalk'];
handler.tags = ['tools'];
handler.command = ['ttstalk', 'tiktokstalk'];

export default handler;