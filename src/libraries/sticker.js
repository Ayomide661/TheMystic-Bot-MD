import { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { ffmpeg } from './converter.js';
import fluentFfmpeg from 'fluent-ffmpeg';
import { spawn } from 'child_process';
import uploadFile from './uploadFile.js';
import uploadImage from './uploadImage.js';
import { fileTypeFromBuffer } from 'file-type';
import { Image } from 'node-webpmux';
import fetch from 'node-fetch';

const __dirname = dirname(fileURLToPath(import.meta.url));
const tmp = path.join(__dirname, '../tmp');

// Ensure tmp directory exists
if (!fs.existsSync(tmp)) {
  fs.mkdirSync(tmp, { recursive: true });
}

/**
 * Image to Sticker using FFmpeg and ImageMagick
 */
function sticker2(img, url) {
  return new Promise(async (resolve, reject) => {
    try {
      if (url) {
        const res = await fetch(url);
        if (res.status !== 200) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
        img = await res.buffer();
      }
      
      const inp = path.join(tmp, `${Date.now()}.jpeg`);
      await fs.promises.writeFile(inp, img);
      
      const ff = spawn('ffmpeg', [
        '-y',
        '-i', inp,
        '-vf', 'scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1',
        '-f', 'png',
        '-'
      ]);
      
      const bufs = [];
      ff.stdout.on('data', chunk => bufs.push(chunk));
      ff.on('error', reject);
      ff.on('close', async () => {
        try {
          await fs.promises.unlink(inp);
        } catch (e) {
          console.error('Error deleting temp file:', e);
        }
      });
      
      // Use ImageMagick if available, otherwise use native conversion
      const im = spawn('convert', ['png:-', 'webp:-']);
      im.on('error', () => {
        // Fallback to manual conversion if ImageMagick fails
        resolve(Buffer.concat(bufs)); // Return PNG if conversion fails
      });
      
      im.stdout.on('data', chunk => bufs.push(chunk));
      ff.stdout.pipe(im.stdin);
      
      im.on('exit', () => {
        resolve(Buffer.concat(bufs));
      });
      
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * Sticker with metadata using external API
 */
async function sticker3(img, url, packname, author) {
  try {
    url = url || await uploadFile(img);
    const params = new URLSearchParams();
    if (packname) params.append('packname', packname);
    if (author) params.append('author', author);
    if (url) params.append('url', url);
    
    const res = await fetch(`https://api.xteam.xyz/sticker/wm?${params}`);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    
    return await res.buffer();
  } catch (error) {
    console.error('Sticker3 error:', error);
    throw error;
  }
}

/**
 * Image to Sticker using FFmpeg
 */
async function sticker4(img, url) {
  try {
    if (url) {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      img = await res.buffer();
    }
    
    return await ffmpeg(img, [
      '-vf', 'scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1'
    ], 'jpeg', 'webp');
  } catch (error) {
    console.error('Sticker4 error:', error);
    throw error;
  }
}

/**
 * Sticker using wa-sticker-formatter
 */
async function sticker5(img, url, packname, author, categories = [''], extra = {}) {
  try {
    const { Sticker } = await import('wa-sticker-formatter');
    const stickerMetadata = {
      type: 'default',
      pack: packname || 'My Pack',
      author: author || 'My Bot',
      categories,
      ...extra
    };
    
    const sticker = new Sticker(img || url, stickerMetadata);
    return await sticker.toBuffer();
  } catch (error) {
    console.error('Sticker5 error:', error);
    throw error;
  }
}

/**
 * Convert using fluent-ffmpeg
 */
function sticker6(img, url) {
  return new Promise(async (resolve, reject) => {
    try {
      if (url) {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        img = await res.buffer();
      }
      
      const type = await fileTypeFromBuffer(img) || { ext: 'bin' };
      if (type.ext === 'bin') {
        reject(new Error('Unsupported file type'));
        return;
      }
      
      const inputPath = path.join(tmp, `${Date.now()}.${type.ext}`);
      const outputPath = path.join(tmp, `${Date.now()}.webp`);
      
      await fs.promises.writeFile(inputPath, img);
      
      const isVideo = /video/i.test(type.mime);
      const command = fluentFfmpeg(inputPath);
      
      if (isVideo) {
        command.inputFormat(type.ext);
      }
      
      command
        .on('error', (err) => {
          console.error('FFmpeg error:', err);
          fs.promises.unlink(inputPath).catch(console.error);
          reject(err);
        })
        .on('end', async () => {
          try {
            const result = await fs.promises.readFile(outputPath);
            await Promise.all([
              fs.promises.unlink(inputPath),
              fs.promises.unlink(outputPath)
            ]);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        })
        .addOutputOptions([
          '-vcodec', 'libwebp',
          '-vf', `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15,pad=320:320:-1:-1:color=white@0.0,split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`
        ])
        .toFormat('webp')
        .save(outputPath);
        
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Add WhatsApp EXIF metadata to sticker
 */
async function addExif(webpSticker, packname, author, categories = [''], metadata = {}) {
  try {
    const img = new Image();
    const stickerPackId = metadata.packId || 'MYSTIC' + crypto.randomBytes(12).toString('hex').toUpperCase();
    
    const json = {
      "sticker-pack-id": stickerPackId,
      "sticker-pack-name": packname || 'My Pack',
      "sticker-pack-publisher": author || 'My Bot',
      "android-app-store-link": metadata.androidAppStoreLink,
      "ios-app-store-link": metadata.iosAppStoreLink,
      "emojis": categories.length ? categories : ['']
    };
    
    // Remove undefined values
    Object.keys(json).forEach(key => json[key] === undefined && delete json[key]);
    
    const jsonBuffer = Buffer.from(JSON.stringify(json), 'utf8');
    const exifAttr = Buffer.from([
      0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 
      0x00, 0x00, 0x16, 0x00, 0x00, 0x00
    ]);
    
    const exif = Buffer.concat([exifAttr, jsonBuffer]);
    exif.writeUIntLE(jsonBuffer.length, 14, 4);
    
    await img.load(webpSticker);
    img.exif = exif;
    
    return await img.save(null);
  } catch (error) {
    console.error('AddExif error:', error);
    // Return original sticker if metadata addition fails
    return webpSticker;
  }
}

/**
 * Main sticker function with fallbacks
 */
async function sticker(img, url, ...args) {
  const methods = [
    sticker5, // wa-sticker-formatter (most reliable)
    sticker3,  // API-based
    sticker6,  // fluent-ffmpeg
    sticker4,  // ffmpeg
    sticker2   // fallback
  ];
  
  for (const method of methods) {
    try {
      const result = await method(img, url, ...args);
      
      // Check if result is a valid buffer
      if (Buffer.isBuffer(result) && result.length > 0) {
        try {
          // Try to add metadata if we have packname/author
          if (args.length >= 2) {
            return await addExif(result, ...args);
          }
          return result;
        } catch (metadataError) {
          console.error('Metadata error, returning raw sticker:', metadataError);
          return result;
        }
      }
    } catch (error) {
      console.error(`Sticker method ${method.name} failed:`, error);
      continue;
    }
  }
  
  throw new Error('All sticker conversion methods failed');
}

// Export functions
export {
  sticker,
  sticker2,
  sticker3,
  sticker4,
  sticker6,
  addExif
};