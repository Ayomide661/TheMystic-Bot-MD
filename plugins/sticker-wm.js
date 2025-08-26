import {
  sticker,
  webpToMp4,
  addExif,
  addAudioMetaData,
  circleSticker
} from '../src/libraries/sticker.js';

const handler = async (m, { conn, args, usedPrefix, command }) => {
  const datas = global;
  const idioma = datas.db.data.users[m.sender].language || global.defaultLenguaje;
  const _translate = JSON.parse(fs.readFileSync(`./src/languages/${idioma}.json`));
  const tradutor = _translate.plugins.sticker;

  try {
    switch (command) {
      case 'sticker':
      case 's': {
        if (!m.quoted || (!m.quoted.video && !m.quoted.image)) {
          return m.reply(tradutor.reply_required || 'Reply to an image or video to convert to sticker');
        }

        const mediaPath = await m.quoted.download();
        const type = m.quoted.image ? 1 : 2;
        const stickerData = await sticker(mediaPath, type);

        return conn.sendFile(m.chat, stickerData, 'sticker.webp', '', m);
      }

      case 'circle': {
        if (!m.quoted || !m.quoted.image) {
          return m.reply(tradutor.circle_reply_required || 'Reply to an image to create a circle sticker');
        }

        const mediaPath = await m.quoted.download();
        const circleData = await circleSticker(mediaPath);

        return conn.sendFile(m.chat, circleData, 'circle-sticker.webp', '', m);
      }

      case 'take': {
        if (!m.quoted || (!m.quoted.sticker && !m.quoted.audio)) {
          return m.reply(tradutor.take_reply_required || 'Reply to a sticker or audio message');
        }

        if (m.quoted.sticker) {
          const media = await m.quoted.download();
          const [packname, author] = args.join(' ').split('|');
          const modifiedSticker = await addExif(media, packname || global.packname, author || global.author);
          
          return conn.sendFile(m.chat, modifiedSticker, 'sticker.webp', '', m);
        }

        if (m.quoted.audio) {
          if (!args[0]) {
            return m.reply(tradutor.take_usage || `Usage: ${usedPrefix}take title,artist,url`);
          }

          const [title, artist, url] = args.join(' ').split(',');
          const audioData = await addAudioMetaData(
            await m.quoted.download(),
            title,
            artist,
            '',
            url
          );

          return conn.sendFile(m.chat, audioData, 'audio.mp3', '', m, null, { mimetype: 'audio/mpeg' });
        }
        break;
      }

      case 'mp4': {
        if (!m.quoted || !m.quoted.sticker || !m.quoted.animated) {
          return m.reply(tradutor.mp4_reply_required || 'Reply to an animated sticker to convert to video');
        }

        const mediaPath = await m.quoted.download();
        const videoBuffer = await webpToMp4(mediaPath);

        return conn.sendFile(m.chat, videoBuffer, 'video.mp4', '', m);
      }

      default:
        return m.reply(`Unknown command: ${command}`);
    }
  } catch (error) {
    console.error(error);
    return m.reply(tradutor.error || 'An error occurred while processing your request');
  }
};

handler.help = [
  'sticker (reply to image/video)',
  'circle (reply to image)',
  'take (reply to sticker/audio)',
  'mp4 (reply to animated sticker)'
];

handler.tags = ['sticker', 'tools'];
handler.command = /^(sticker|s|circle|take|mp4)$/i;

export default handler;