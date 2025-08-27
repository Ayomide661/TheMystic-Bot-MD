import {unlinkSync, readFileSync} from 'fs';
import {join} from 'path';
import {exec} from 'child_process';

const handler = async (m, {conn, args, __dirname, usedPrefix, command}) => {
  try {
    if (!args[0]) {
      return conn.reply(m.chat, `*Please specify an effect!*\n\nAvailable effects:\n• *${usedPrefix}effect bass*\n• *${usedPrefix}effect blown*\n• *${usedPrefix}effect deep*\n• *${usedPrefix}effect earrape*\n• *${usedPrefix}effect fast*\n• *${usedPrefix}effect fat*\n• *${usedPrefix}effect nightcore*\n• *${usedPrefix}effect reverse*\n• *${usedPrefix}effect robot*\n• *${usedPrefix}effect slow*\n• *${usedPrefix}effect smooth*\n• *${usedPrefix}effect chipmunk*`, m);
    }
    
    const q = m.quoted ? m.quoted : m;
    const mime = ((m.quoted ? m.quoted : m.msg).mimetype || '');
    
    let set;
    const effect = args[0].toLowerCase();
    
    if (/bass/.test(effect)) set = '-af equalizer=f=94:width_type=o:width=2:g=30';
    else if (/blown/.test(effect)) set = '-af acrusher=.1:1:64:0:log';
    else if (/deep/.test(effect)) set = '-af atempo=4/4,asetrate=44500*2/3';
    else if (/earrape/.test(effect)) set = '-af volume=12';
    else if (/fast/.test(effect)) set = '-filter:a "atempo=1.63,asetrate=44100"';
    else if (/fat/.test(effect)) set = '-filter:a "atempo=1.6,asetrate=22100"';
    else if (/nightcore/.test(effect)) set = '-filter:a atempo=1.06,asetrate=44100*1.25';
    else if (/reverse/.test(effect)) set = '-filter_complex "areverse"';
    else if (/robot/.test(effect)) set = '-filter_complex "afftfilt=real=\'hypot(re,im)*sin(0)\':imag=\'hypot(re,im)*cos(0)\':win_size=512:overlap=0.75"';
    else if (/slow/.test(effect)) set = '-filter:a "atempo=0.7,asetrate=44100"';
    else if (/smooth/.test(effect)) set = '-filter:v "minterpolate=\'mi_mode=mci:mc_mode=aobmc:vsbmc=1:fps=120\'"';
    else if (/tupai|squirrel|chipmunk/.test(effect)) set = '-filter:a "atempo=0.5,asetrate=65100"';
    else {
      return conn.reply(m.chat, `*Invalid effect!*\n\nAvailable effects:\n• *${usedPrefix}effect bass*\n• *${usedPrefix}effect blown*\n• *${usedPrefix}effect deep*\n• *${usedPrefix}effect earrape*\n• *${usedPrefix}effect fast*\n• *${usedPrefix}effect fat*\n• *${usedPrefix}effect nightcore*\n• *${usedPrefix}effect reverse*\n• *${usedPrefix}effect robot*\n• *${usedPrefix}effect slow*\n• *${usedPrefix}effect smooth*\n• *${usedPrefix}effect chipmunk*`, m);
    }

    if (/audio/.test(mime)) {
      const ran = getRandom('.mp3');
      const filename = join(__dirname, '../src/tmp/' + ran);
      const media = await q.download(true);
      
      conn.reply(m.chat, '*Applying audio effect...*', m);
      
      exec(`ffmpeg -i ${media} ${set} ${filename}`, async (err, stderr, stdout) => {
        await unlinkSync(media);
        if (err) {
          await unlinkSync(filename);
          throw '*Error processing audio!*';
        }
        
        const buff = await readFileSync(filename);
        conn.sendMessage(m.chat, {audio: buff, filename: ran, mimetype: 'audio/mpeg'}, {quoted: m});
        await unlinkSync(filename);
      });
    } else {
      throw `*Please reply to an audio message!*\n\nExample: *${usedPrefix}effect bass* (reply to an audio)`;
    }
  } catch (e) {
    throw e;
  }
};

handler.help = ['effect <effect_name>'];
handler.tags = ['audio'];
handler.command = /^(effect)$/i;

export default handler;

const getRandom = (ext) => {
  return `${Math.floor(Math.random() * 10000)}${ext}`;
};