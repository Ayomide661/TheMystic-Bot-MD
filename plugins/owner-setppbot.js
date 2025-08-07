import Jimp from 'jimp';

const handler = async (m, { conn, usedPrefix, command }) => {
  try {
    const userJid = conn.user?.jid;
    const quoted = m.quoted ? m.quoted : m;

    if (!m.quoted || !quoted.mimetype?.includes('image')) throw `*[❗INFO❗] NO IMAGE FOUND. REPLY TO AN IMAGE USING THE COMMAND ${usedPrefix + command}*`;

    const imgData = await quoted.download();
    const jpegBuffer = await processImage(imgData);

    await conn.updateProfilePicture(userJid, jpegBuffer);
    await m.reply('*[ ✅ ] BOT PROFILE PICTURE CHANGED SUCCESSFULLY.*');
  } catch (err) {
    await m.reply(`*[❗ERROR❗] An error occurred while trying to change the profile picture:\n\n${err?.message || err}*`);
  }
};

handler.command = /^setppbot$/i;
handler.rowner = true;
export default handler;

async function processImage(imgBuffer) {
  const image = await Jimp.read(imgBuffer);
  const resized = image.getWidth() > image.getHeight() ? image.resize(720, Jimp.AUTO) : image.resize(Jimp.AUTO, 720);
  const jpegBuffer = await resized.getBufferAsync(Jimp.MIME_JPEG);
  return jpegBuffer;
}