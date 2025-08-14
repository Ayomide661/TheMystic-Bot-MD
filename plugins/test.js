const handler = async (m) => {
    m.reply('Bot is working! Command received: ' + m.text);
};
handler.command = /^test-command$/i;
export default handler;