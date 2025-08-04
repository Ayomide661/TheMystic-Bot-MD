/* Credits to https://github.com/unptoadrih15/UPABOT-MD */

const handler = async (m, {conn, isAdmin}) => {
  const datas = global;
  const language = datas.db.data.users[m.sender].language || global.defaultLanguage;
  const _translate = JSON.parse(fs.readFileSync(`./src/languages/${language}.json`));
  const translator = _translate.plugins.owner_autoadmin;

  // Ignore if message is from the bot itself
  if (m.fromMe) return;
  
  // Check if user is already admin
  if (isAdmin) throw translator.texto1;
  
  try {
    // Promote user to admin
    await conn.groupParticipantsUpdate(m.chat, [m.sender], 'promote');
  } catch (error) {
    console.error('Auto-admin error:', error);
    await m.reply(translator.texto2 || 'Failed to grant admin privileges');
  }
};

handler.command = /^autoadmin$/i;
handler.rowner = true;       // Only bot owner can use
handler.group = true;        // Only works in groups
handler.botAdmin = true;     // Bot must be admin
export default handler;