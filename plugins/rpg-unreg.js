import {createHash} from 'crypto';

const handler = async function(m, {args}) {
  if (!args[0]) throw "Please enter your serial number to unregister";
  
  const user = global.db.data.users[m.sender];
  const sn = createHash('md5').update(m.sender).digest('hex');
  
  if (args[0] !== sn) throw "Invalid serial number!";
  
  user.registered = false;
  m.reply("Successfully unregistered! Your account has been removed from the database.");
};

handler.help = ['unreg <serial number>'];
handler.tags = ['xp'];
handler.command = /^unreg(ister)?$/i;
handler.register = true;
export default handler;