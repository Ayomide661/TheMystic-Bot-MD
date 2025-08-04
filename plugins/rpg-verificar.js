import {createHash} from 'crypto';
const Reg = /\|?(.*)([.|] *?)([0-9]*)$/i;

const handler = async function(m, {conn, text, usedPrefix, command}) {
  const user = global.db.data.users[m.sender];
  const name2 = conn.getName(m.sender);
  const pp = await conn.profilePictureUrl(m.sender, 'image').catch((_) => global.imagen1);

  // Error messages in English
  const errors = {
    alreadyRegistered: `You are already registered!\nUse *${usedPrefix}unreg* to unregister your account`,
    invalidFormat: `Invalid format!\nExample: ${usedPrefix + command} Name.Age\nOr: ${usedPrefix + command} Name|Age`,
    noName: 'Please enter your name',
    noAge: 'Please enter your age',
    nameTooLong: 'Name is too long (max 30 characters)',
    ageTooHigh: 'Age is too high (max 100 years)',
    ageTooLow: 'Age is too low (min 5 years)'
  };

  // Success message template
  const successMessage = (name, age, sn) => `╭─「 *REGISTRATION SUCCESSFUL* 」
│
│ • Thank you for registering!
│ • Here's your account info:
│
│ • Name: ${name}
│ • Age: ${age} years
│ 
│ • Serial Number: 
│ ${sn}
│
│ • You received:
│ 10,000 Money 💰
│ 10,000 Exp ⚡
│
╰───────────────`;

  if (user.registered === true) throw errors.alreadyRegistered;
  if (!Reg.test(text)) throw errors.invalidFormat;

  let [_, name, splitter, age] = text.match(Reg);
  if (!name) throw errors.noName;
  if (!age) throw errors.noAge;
  if (name.length >= 30) throw errors.nameTooLong;

  age = parseInt(age);
  if (age > 100) throw errors.ageTooHigh;
  if (age < 5) throw errors.ageTooLow;

  user.name = name.trim();
  user.age = age;
  user.regTime = + new Date;
  user.registered = true;

  const sn = createHash('md5').update(m.sender).digest('hex');
  
  // Send registration confirmation
  await conn.sendFile(m.chat, pp, 'profile.jpg', successMessage(name, age, sn), m);

  // Reward for registering
  user.money += 10000;
  user.exp += 10000;
};

handler.help = ['verify'];
handler.tags = ['xp'];
handler.command = /^(verify|register|reg)$/i;
export default handler;