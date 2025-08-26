import { sticker } from '../src/libraries/sticker.js';
import axios from 'axios';
import fs from 'fs';

const handler = async (m, {conn, args, usedPrefix, command}) => {
    const datas = global;
    const idioma = datas.db.data.users[m.sender].language || global.defaultLenguaje;
    const _translate = JSON.parse(fs.readFileSync(`./src/languages/${idioma}.json`));
    const tradutor = _translate.plugins.sticker_qc;

    let text;
    if (args.length >= 1) {
        text = args.slice(0).join(" ");
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text;
    } else {
        throw tradutor.text1 || "Please provide text or quote a message";
    }
    
    if (!text) return m.reply(tradutor.text2 || "No text found");
    
    const who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender; 
    const mentionRegex = new RegExp(`@${who.split('@')[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*`, 'g');
    const mishi = text.replace(mentionRegex, '');
    
    if (mishi.length > 30) return m.reply(tradutor.text3 || "Text is too long (max 30 characters)");
    
    try {
        const pp = await conn.profilePictureUrl(who).catch((_) => 'https://telegra.ph/file/24fa902ead26340f3df2c.png');
        const nombre = await conn.getName(who);
        
        // Alternative API endpoint that might work better
        const apiUrl = 'https://api.erdwpe.com/api/maker/quotemaker';
        
        const formData = new URLSearchParams();
        formData.append('text', mishi);
        formData.append('username', nombre);
        formData.append('avatar', pp);
        
        const response = await axios.post(apiUrl, formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            responseType: 'arraybuffer'
        });
        
        if (!response.data || response.data.length === 0) {
            throw new Error('Empty response from quote API');
        }
        
        // Convert the arraybuffer to buffer
        const buffer = Buffer.from(response.data);
        
        // Create sticker
        const stiker = await sticker(buffer, false, global.packname, global.author);
        
        if (stiker && stiker.length > 0) {
            return conn.sendFile(m.chat, stiker, 'sticker.webp', '', m);
        } else {
            // Fallback: send as image if sticker creation fails
            return conn.sendFile(m.chat, buffer, 'quote.png', '', m);
        }
        
    } catch (error) {
        console.error('Error in qc command:', error);
        
        // Try an alternative method if the first API fails
        try {
            // Using a different quote API
            const altApiUrl = `https://api.lolhuman.xyz/api/quote2?apikey=your_api_key&text=${encodeURIComponent(mishi)}&username=${encodeURIComponent(nombre)}`;
            const response = await axios.get(altApiUrl, { responseType: 'arraybuffer' });
            
            if (response.data && response.data.length > 0) {
                const buffer = Buffer.from(response.data);
                const stiker = await sticker(buffer, false, global.packname, global.author);
                
                if (stiker && stiker.length > 0) {
                    return conn.sendFile(m.chat, stiker, 'sticker.webp', '', m);
                } else {
                    return conn.sendFile(m.chat, buffer, 'quote.png', '', m);
                }
            }
        } catch (fallbackError) {
            console.error('Fallback also failed:', fallbackError);
            return m.reply(tradutor.text4 || "Failed to create quote sticker. Please try again later.");
        }
        
        return m.reply(tradutor.text4 || "Failed to create quote sticker. Please try again later.");
    }
}

handler.help = ['qc'];
handler.tags = ['sticker'];
handler.command = /^(qc)$/i;
export default handler;