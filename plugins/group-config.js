// This is a JavaScript function that allows a group admin to open or close a group chat.
// It handles different language inputs for the "open" and "close" commands.

const handler = async (m, { conn, args, usedPrefix, command }) => {
  // Define global data and language settings.
  const datas = global;
  const language = datas.db.data.users[m.sender].language || global.defaultLanguage;
  const translator = JSON.parse(fs.readFileSync(`./src/languages/${language}.json`)).plugins.gc_config;

  // Determine the group setting based on the command argument.
  const isClose = {
    'open': 'not_announcement', // Open the group for all members to send messages.
    'close': 'announcement',   // Close the group, restricting it to admins only.
    'abierto': 'not_announcement',
    'cerrado': 'announcement',
    'abrir': 'not_announcement',
    'cerrar': 'announcement',
  }[(args[0] || '')];

  // If the command argument is not recognized, throw an error with instructions.
  if (isClose === undefined) {
    throw `
${translator.text1[0]}

${translator.text1[1]}
*┠┉↯ ${usedPrefix + command} open*
*┠┉↯ ${usedPrefix + command} close*
`.trim();
  }

  // Update the group setting.
  await conn.groupSettingUpdate(m.chat, isClose);

  // Reply to the user with a confirmation message.
  { m.reply(`${translator.text1[0]}`); }
};

// Define the command's help and tags.
handler.help = ['group open / close'];
handler.tags = ['group'];

// Define the command name.
handler.command = ['group', 'grupo'];

// Require the user to be a group admin and the bot to be a group admin.
handler.admin = true;
handler.botAdmin = true;

// Export the handler.
export default handler;
