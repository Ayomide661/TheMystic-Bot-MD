// This is a JavaScript function that sets the welcome message for a group chat.
// It uses a handler to process the message and check for necessary permissions.

const handler = async (m, { conn, text, isROwner, isOwner }) => {
  // Define global data and language settings.
  const datas = global;
  const language = datas.db.data.users[m.sender].language || global.defaultLanguage;
  const translator = JSON.parse(fs.readFileSync(`./src/languages/${language}.json`)).plugins.gc_setwelcome;

  // Check if a welcome message is provided.
  if (text) {
    // If a message is provided, update the welcome message for the group chat.
    global.db.data.chats[m.chat].sWelcome = text;
    // Reply to the user with a confirmation message.
    m.reply(translator.text1);
  } else {
    // If no message is provided, throw an error with instructions and available placeholders.
    throw `${translator.text2[0]}\n*- @user (mention)*\n*- @group (group name)*\n*- @desc (group description)*`;
  }
};

// Define the command's help and tags.
handler.help = ['setwelcome <text>'];
handler.tags = ['group'];

// Define the command name.
handler.command = ['setwelcome'];

// Require the user to be a group admin to use this command.
handler.admin = true;

// Export the handler.
export default handler;
