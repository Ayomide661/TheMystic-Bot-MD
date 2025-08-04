import { createHash } from 'crypto';
const Reg = /\|?(.*)([.|] *?)([0-9]*)$/i;

const handler = async function(m, { conn, text, usedPrefix, command }) {
  const user = global.db.data.users[m.sender];
  const name2 = conn.getName(m.sender);
  
  // Get profile picture with fallback
  const pp = await conn.profilePictureUrl(m.sender, 'image')
    .catch(() => 'https://i.imgur.com/8Km9tLL.jpg'); // Default avatar

  // Error messages
  const errors = {
    alreadyRegistered: `🎯 You're already registered!\nUse *${usedPrefix}unreg* to reset your account`,
    invalidFormat: `📝 Format: ${usedPrefix + command} Name.Age\nExample: ${usedPrefix + command} Shadow.18`,
    noName: '❌ Please provide your name',
    noAge: '❌ Please provide your age',
    nameTooLong: '❌ Name too long (max 30 characters)',
    ageTooHigh: '❌ Maximum age is 100 years',
    ageTooLow: '❌ Minimum age is 5 years'
  };

  // Success message template
  const successMessage = (name, age, sn) => `╭━━〘 REGISTRATION 〙━━⬣
│
│ 🎉 Welcome ${name}!
│
│ 📝 Account Details:
│ ├ Age: ${age} years
│ ├ Serial: ${sn}
│
│ 🎁 Starter Pack:
│ ├ 10,000 Money 💰
│ ├ 10,000 Exp ⚡
│
╰━━━━━━━━━━━━━━━━⬣`;

  // Validation checks
  if (user.registered) throw errors.alreadyRegistered;
  if (!text || !Reg.test(text)) throw errors.invalidFormat;

  let [_, name, splitter, age] = text.match(Reg);
  name = name.trim();
  age = parseInt(age);

  if (!name) throw errors.noName;
  if (!age) throw errors.noAge;
  if (name.length > 30) throw errors.nameTooLong;
  if (age > 100) throw errors.ageTooHigh;
  if (age < 5) throw errors.ageTooLow;

  // Save user data
  user.name = name;
  user.age = age;
  user.regTime = Date.now();
  user.registered = true;
  user.exp = (user.exp || 0) + 10000;
  user.money = (user.money || 0) + 10000;

  // Generate serial number
  const sn = createHash('md5').update(m.sender).digest('hex');

  // Send confirmation
  await conn.sendMessage(m.chat, {
    image: { url: pp },
    caption: successMessage(name, age, sn),
    mentions: [m.sender]
  }, { quoted: m });
};

handler.help = ['register'];
handler.tags = ['xp'];
handler.command = /^(verify|register|reg|registrar)$/i;
export default handler;