import fetch from 'node-fetch';
import { FormData, Blob } from 'formdata-node';
import { JSDOM } from 'jsdom';
import { fileTypeFromBuffer } from 'file-type';

/**
 * Convert WebP to MP4 using ezgif.com
 * @param {Buffer|String} source 
 */
async function webp2mp4(source) {
    try {
        const form = new FormData();
        const isUrl = typeof source === 'string' && /https?:\/\//.test(source);
        
        if (isUrl) {
            form.append('new-image-url', source);
        } else {
            // Ensure source is a Buffer
            const buffer = Buffer.isBuffer(source) ? source : Buffer.from(source);
            const blob = new Blob([buffer], { type: 'image/webp' });
            form.append('new-image', blob, 'image.webp');
        }

        // First request to upload the image
        const res = await fetch('https://ezgif.com/webp-to-mp4', {
            method: 'POST',
            body: form
        });
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const html = await res.text();
        const { document } = new JSDOM(html).window;
        
        // Find the conversion form
        const form2 = new FormData();
        const obj = {};
        
        const formInputs = document.querySelectorAll('form input[name]');
        for (const input of formInputs) {
            obj[input.name] = input.value;
            form2.append(input.name, input.value);
        }
        
        if (!obj.file) {
            throw new Error('Could not find file parameter in response');
        }

        // Second request to process the conversion
        const res2 = await fetch('https://ezgif.com/webp-to-mp4/' + obj.file, {
            method: 'POST',
            body: form2
        });
        
        if (!res2.ok) {
            throw new Error(`HTTP error! status: ${res2.status}`);
        }
        
        const html2 = await res2.text();
        const { document: document2 } = new JSDOM(html2).window;
        
        // Find the result video
        const videoSource = document2.querySelector('div#output > p.outfile > video > source');
        if (!videoSource || !videoSource.src) {
            throw new Error('Could not find converted video in response');
        }
        
        return new URL(videoSource.src, res2.url).toString();
        
    } catch (error) {
        console.error('webp2mp4 error:', error);
        throw error;
    }
}

/**
 * Convert WebP to PNG using ezgif.com
 * @param {Buffer|String} source 
 */
async function webp2png(source) {
    try {
        const form = new FormData();
        const isUrl = typeof source === 'string' && /https?:\/\//.test(source);
        
        if (isUrl) {
            form.append('new-image-url', source);
        } else {
            // Ensure source is a Buffer
            const buffer = Buffer.isBuffer(source) ? source : Buffer.from(source);
            const blob = new Blob([buffer], { type: 'image/webp' });
            form.append('new-image', blob, 'image.webp');
        }

        // First request to upload the image
        const res = await fetch('https://ezgif.com/webp-to-png', {
            method: 'POST',
            body: form
        });
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const html = await res.text();
        const { document } = new JSDOM(html).window;
        
        // Find the conversion form
        const form2 = new FormData();
        const obj = {};
        
        const formInputs = document.querySelectorAll('form input[name]');
        for (const input of formInputs) {
            obj[input.name] = input.value;
            form2.append(input.name, input.value);
        }
        
        if (!obj.file) {
            throw new Error('Could not find file parameter in response');
        }

        // Second request to process the conversion
        const res2 = await fetch('https://ezgif.com/webp-to-png/' + obj.file, {
            method: 'POST',
            body: form2
        });
        
        if (!res2.ok) {
            throw new Error(`HTTP error! status: ${res2.status}`);
        }
        
        const html2 = await res2.text();
        const { document: document2 } = new JSDOM(html2).window;
        
        // Find the result image
        const imgElement = document2.querySelector('div#output > p.outfile > img');
        if (!imgElement || !imgElement.src) {
            throw new Error('Could not find converted image in response');
        }
        
        return new URL(imgElement.src, res2.url).toString();
        
    } catch (error) {
        console.error('webp2png error:', error);
        throw error;
    }
}

/**
 * Alternative method using direct download instead of URL
 */
async function webp2mp4Buffer(source) {
    try {
        const url = await webp2mp4(source);
        const response = await fetch(url);
        return await response.buffer();
    } catch (error) {
        console.error('webp2mp4Buffer error:', error);
        throw error;
    }
}

async function webp2pngBuffer(source) {
    try {
        const url = await webp2png(source);
        const response = await fetch(url);
        return await response.buffer();
    } catch (error) {
        console.error('webp2pngBuffer error:', error);
        throw error;
    }
}

export {
    webp2mp4,
    webp2png,
    webp2mp4Buffer,
    webp2pngBuffer
};