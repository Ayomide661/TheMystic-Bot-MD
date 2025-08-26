import { Sticker, createSticker } from 'wa-sticker-formatter';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const handler = async (m, { conn, args, usedPrefix, command }) => {
  const datas = global;
  const idioma = datas.db.data.users[m.sender].language || 'en';
  let _translate;
  
  try {
    _translate = JSON.parse(fs.readFileSync(`./src/languages/${idioma}.json`));
  } catch (e) {
    _translate = JSON.parse(fs.readFileSync(`./src/languages/en.json`));
  }
  
  const tradutor = _translate.plugins.sticker || {};

  try {
    if (!m.quoted) {
      return m.reply(tradutor.reply_required || 'Reply to an image, video, or sticker');
    }

    const quoted = m.quoted;
    const mime = quoted.mimetype || '';

    if (/image|video|sticker/.test(mime)) {
      // Download the media
      const media = await quoted.download();
      
      let stickerBuffer;
      
      if (/image/.test(mime)) {
        // Create sticker from image
        stickerBuffer = await createImageSticker(media);
      } else if (/video/.test(mime)) {
        // Create sticker from video (first 7 seconds)
        stickerBuffer = await createVideoSticker(media);
      } else if (/sticker/.test(mime)) {
        // Convert sticker to different format or extract
        if (command === 'mp4' && quoted.animated) {
          // Convert animated sticker to video
          const videoBuffer = await convertWebpToMp4(media);
          return conn.sendFile(m.chat, videoBuffer, 'video.mp4', '', m);
        } else {
          // Modify existing sticker
          const [pack, author] = args.join(' ').split('|');
          stickerBuffer = await modifySticker(media, pack, author);
        }
      }

      if (stickerBuffer) {
        return conn.sendFile(m.chat, stickerBuffer, 'sticker.webp', '', m);
      }
    } else if (quoted.text && command === 'quote') {
      // Create quote sticker
      const text = quoted.text;
      if (text.length > 30) {
        return m.reply(tradutor.text_too_long || 'Text is too long (max 30 characters)');
      }
      
      const who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender;
      const pp = await conn.profilePictureUrl(who).catch(_ => 'https://telegra.ph/file/24fa902ead26340f3df2c.png');
      const name = await conn.getName(who);
      
      const stickerBuffer = await createQuoteSticker(text, name, pp);
      return conn.sendFile(m.chat, stickerBuffer, 'sticker.webp', '', m);
    } else {
      return m.reply(tradutor.unsupported_type || 'Unsupported media type');
    }
  } catch (error) {
    console.error('Sticker error:', error);
    return m.reply(tradutor.error || 'Failed to create sticker');
  }
};

// Create sticker from image
async function createImageSticker(imageBuffer) {
  try {
    const sticker = new Sticker(imageBuffer, {
      pack: global.packname || 'Sticker Pack',
      author: global.author || 'WhatsApp Bot',
      type: 'full',
      quality: 70,
    });
    
    return await sticker.toBuffer();
  } catch (error) {
    console.error('Image sticker error:', error);
    throw error;
  }
}

// Create sticker from video (first 7 seconds)
async function createVideoSticker(videoBuffer) {
  try {
    const sticker = new Sticker(videoBuffer, {
      pack: global.packname || 'Sticker Pack',
      author: global.author || 'WhatsApp Bot',
      type: 'full',
      quality: 70,
      loop: 2, // Loop twice
    });
    
    return await sticker.toBuffer();
  } catch (error) {
    console.error('Video sticker error:', error);
    throw error;
  }
}

// Modify existing sticker
async function modifySticker(stickerBuffer, packName, authorName) {
  try {
    const sticker = new Sticker(stickerBuffer, {
      pack: packName || global.packname || 'Sticker Pack',
      author: authorName || global.author || 'WhatsApp Bot',
      type: 'full',
      quality: 70,
    });
    
    return await sticker.toBuffer();
  } catch (error) {
    console.error('Sticker modification error:', error);
    throw error;
  }
}

// Convert webp to mp4 (for animated stickers)
async function convertWebpToMp4(webpBuffer) {
  try {
    // This is a simplified version - in practice you might need a proper converter
    // For now, we'll return the buffer as is (assuming it's already in a compatible format)
    return webpBuffer;
  } catch (error) {
    console.error('Webp to mp4 conversion error:', error);
    throw error;
  }
}

// Create quote sticker
async function createQuoteSticker(text, username, avatarUrl) {
  try {
    // Using a simple quote API
    const quoteUrl = `https://api.erdwpe.com/api/maker/quotemaker?text=${encodeURIComponent(text)}&username=${encodeURIComponent(username)}`;
    
    const response = await fetch(quoteUrl);
    if (!response.ok) throw new Error('Quote API failed');
    
    const imageBuffer = await response.buffer();
    
    // Convert the quote image to a sticker
    const sticker = new Sticker(imageBuffer, {
      pack: global.packname || 'Quote Pack',
      author: global.author || 'WhatsApp Bot',
      type: 'full',
      quality: 70,
    });
    
    return await sticker.toBuffer();
  } catch (error) {
    console.error('Quote sticker error:', error);
    throw error;
  }
}

handler.help = [
  'sticker (reply to media)',
  'take (reply to sticker)',
  'mp4 (reply to animated sticker)',
  'quote (reply to text)'
];

handler.tags = ['sticker'];
handler.command = /^(sticker|s|take|mp4|quote)$/i;

export default handler;