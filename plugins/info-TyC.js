const handler = async (m, {conn}) => {
  const datas = global;
  const language = datas.db.data.users[m.sender].language || global.defaultLanguage;
  const _translate = JSON.parse(fs.readFileSync(`./src/languages/${language}.json`));
  const translator = _translate.plugins.info_tos; // Changed from info_tyc to info_tos (Terms of Service)
  
  global.terms = translator.texto1; // Changed variable names to English

  m.reply(global.terms);
};

handler.help = ['tos']; // Changed from 'tyc' to 'tos' (Terms of Service)
handler.tags = ['info'];
handler.command = /^(termsandconditions|termsandprivacy|termsofservice|tos|terms of service|terms and conditions|privacy policy|terms of use|conditions of use)$/i;
export default handler;