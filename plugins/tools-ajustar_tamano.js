import uploadImage from '../src/libraries/uploadImage.js';
import fetch from 'node-fetch';

const handler = async (m, {conn, usedPrefix, command, args, text}) => {
  const q = m.quoted ? m.quoted : m;
  const mime = (q.msg || q).mimetype || '';
  if (!mime) throw "Please quote/reply to an image or video";
  if (!text) throw "Please specify the new file size (in KB)";
  if (isNaN(text)) throw "Invalid number format for file size";
  if (!/image\/(jpe?g|png)|video|document/.test(mime)) throw "Unsupported file type (only JPEG/PNG images or videos)";
  const img = await q.download();
  const url = await uploadImage(img);

  if (/image\/(jpe?g|png)/.test(mime)) {
    conn.sendMessage(m.chat, {
      image: {url: url}, 
      caption: `File size adjusted to ${text}KB`, 
      fileLength: `${text}`, 
      mentions: [m.sender]
    }, {
      ephemeralExpiration: 24*3600, 
      quoted: m
    });
  } else if (/video/.test(mime)) {
    return conn.sendMessage(m.chat, {
      video: {url: url}, 
      caption: `File size adjusted to ${text}KB`, 
      fileLength: `${text}`, 
      mentions: [m.sender]
    }, {
      ephemeralExpiration: 24*3600, 
      quoted: m
    });
  }
};

handler.tags = ['tools'];
handler.help = ['size <amount>'];
handler.command = /^(length|filelength|editsize|resize|size)$/i;
export default handler;