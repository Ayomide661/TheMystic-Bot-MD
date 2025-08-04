import {createHash} from 'crypto';
import PhoneNumber from 'awesome-phonenumber';
import fetch from 'node-fetch';

const handler = async (m, {conn, usedPrefix, participants, isPrems}) => {
  let texto = await m.mentionedJid;
  let who = texto.length > 0 ? texto[0] : (m.quoted ? await m.quoted.sender : m.sender);
  if (!(who in global.db.data.users)) throw "User not found in database";

  try {
    const pp = await conn.profilePictureUrl(who, 'image').catch(_ => 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60');
    const {name, limit, lastclaim, registered, regTime, age, premiumTime} = global.db.data.users[who];
    const username = conn.getName(who);
    const prem = global.prems.includes(who.split`@`[0]);
    const sn = createHash('md5').update(who).digest('hex');

    const str = `—◉ *PROFILE INFO* ${username} ${registered ? '(' + name + ') ' : ''}
—◉ *Phone:* ${PhoneNumber('+' + who.replace('@s.whatsapp.net', '')).getNumber('international')}
—◉ *WhatsApp:* wa.me/${who.split`@`[0]} ${registered ? '| Age: ' + age + ' years' : ''}
—◉ *Limits:* ${formatNumber(limit)} Diamonds
—◉ *Registered:* ${registered ? '✅ Yes' : '❌ No'}
—◉ *Premium:* ${premiumTime > 0 ? '✅ Yes' : (isPrems ? '✅ Yes' : '❌ No') || ''}
—◉ *Serial Number:*  
${sn}`;

    conn.sendMessage(m.chat, {image: {url: pp}, caption: str}, {quoted: m});
  } catch (error) {
    console.log(error);
  }
};

handler.help = ['profile'];
handler.tags = ['xp'];
handler.command = /^profile?$/i;

export default handler;

function formatNumber(num) {
  const numberSymbols = {
    '0': '𝟶', '1': '𝟷', '2': '𝟸', '3': '𝟹', '4': '𝟺',
    '5': '𝟻', '6': '𝟼', '7': '𝟽', '8': '𝟾', '9': '𝟿', ',': ','
  };

  let numString = num.toLocaleString().replace(/,/g, '#');
  let result = '';
  for (let i = 0; i < numString.length; i++) {
    result += numberSymbols[numString[i]] || numString[i];
  }
  return result;
}