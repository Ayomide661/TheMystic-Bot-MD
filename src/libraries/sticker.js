import { writeFile, readFile, unlink } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { spawn } from 'child_process';
import fetch from 'node-fetch';
import { Image } from 'node-webpmux';
import crypto from 'crypto';

// Simple FFmpeg-based converter
async function convertWithFFmpeg(inputBuffer, options = {}) {
  return new Promise(async (resolve, reject) => {
    const inputExt = options.inputExt || 'jpg';
    const outputExt = options.outputExt || 'webp';
    const inputPath = join(tmpdir(), `input_${Date.now()}.${inputExt}`);
    const outputPath = join(tmpdir(), `output_${Date.now()}.${outputExt}`);
    
    try {
      // Write input buffer to temporary file
      await writeFile(inputPath, inputBuffer);
      
      // Build FFmpeg command
      const args = [
        '-y', // Overwrite output file
        '-i', inputPath,
      ];
      
      // Add video filters for images
      if (options.isImage) {
        args.push('-vf', 'scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1');
      }
      
      // Add output options
      args.push(outputPath);
      
      // Execute FFmpeg
      const ffmpeg = spawn('ffmpeg', args);
      
      ffmpeg.on('close', async (code) => {
        try {
          if (code === 0) {
            const outputBuffer = await readFile(outputPath);
            // Clean up temporary files
            await Promise.all([
              unlink(inputPath).catch(() => {}),
              unlink(outputPath).catch(() => {})
            ]);
            resolve(outputBuffer);
          } else {
            reject(new Error(`FFmpeg exited with code ${code}`));
          }
        } catch (error) {
          reject(error);
        }
      });
      
      ffmpeg.on('error', (error) => {
        reject(error);
      });
      
    } catch (error) {
      reject(error);
    }
  });
}

// Add EXIF metadata to WebP sticker
async function addExif(webpBuffer, packname, author) {
  try {
    const img = new Image();
    await img.load(webpBuffer);
    
    const stickerPackId = crypto.randomBytes(10).toString('hex').toUpperCase();
    const json = {
      "sticker-pack-id": stickerPackId,
      "sticker-pack-name": packname || "My Pack",
      "sticker-pack-publisher": author || "My Bot",
      "emojis": ["😄"]
    };
    
    const exifAttr = Buffer.from([
      0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 
      0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00
    ]);
    
    const jsonBuffer = Buffer.from(JSON.stringify(json), 'utf8');
    const exif = Buffer.concat([exifAttr, jsonBuffer]);
    exif.writeUIntLE(jsonBuffer.length, 14, 4);
    
    img.exif = exif;
    return await img.save(null);
  } catch (error) {
    console.error('Error adding EXIF metadata:', error);
    // Return original buffer if metadata addition fails
    return webpBuffer;
  }
}

// Main sticker creation function
async function createSticker(input, options = {}) {
  try {
    let inputBuffer;
    
    // Handle URL or buffer input
    if (typeof input === 'string') {
      const response = await fetch(input);
      if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
      inputBuffer = await response.buffer();
    } else if (Buffer.isBuffer(input)) {
      inputBuffer = input;
    } else {
      throw new Error('Input must be a URL string or Buffer');
    }
    
    // Convert to WebP using FFmpeg
    const webpBuffer = await convertWithFFmpeg(inputBuffer, {
      isImage: options.isImage !== false,
      inputExt: options.inputExt,
      outputExt: 'webp'
    });
    
    // Check if buffer is valid
    if (!webpBuffer || webpBuffer.length === 0) {
      throw new Error('Failed to convert to WebP: Empty buffer');
    }
    
    // Add metadata if provided
    if (options.packname || options.author) {
      return await addExif(webpBuffer, options.packname, options.author);
    }
    
    return webpBuffer;
  } catch (error) {
    console.error('Sticker creation error:', error);
    throw error;
  }
}

// Alternative: Use external API as fallback
async function createStickerWithAPI(imageBuffer, packname, author) {
  try {
    // First, try to upload the image
    const formData = new FormData();
    const blob = new Blob([imageBuffer], { type: 'image/jpeg' });
    formData.append('file', blob, 'image.jpg');
    
    const uploadResponse = await fetch('https://api.imgbb.com/1/upload?key=YOUR_API_KEY', {
      method: 'POST',
      body: formData
    });
    
    const uploadData = await uploadResponse.json();
    if (!uploadData.success) throw new Error('Image upload failed');
    
    const imageUrl = uploadData.data.url;
    
    // Then use sticker API
    const stickerResponse = await fetch('https://api.xteam.xyz/sticker/wm?' + new URLSearchParams({
      url: imageUrl,
      packname: packname || '',
      author: author || ''
    }));
    
    return await stickerResponse.buffer();
  } catch (error) {
    console.error('API sticker creation failed:', error);
    throw error;
  }
}

export {
  createSticker,
  createStickerWithAPI,
  addExif
};