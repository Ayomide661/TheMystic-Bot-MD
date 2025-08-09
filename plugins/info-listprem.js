import fs from 'fs';

const handler = async (m, {conn, args, isPrems}) => {
  const datas = global;
  const idioma = datas.db.data.users[m.sender].language || global.defaultLenguaje;
  const _translate = JSON.parse(fs.readFileSync(`./src/languages/${idioma}.json`));
  const tradutor = _translate.plugins.info_listprem;

  const usuario = global.db.data.users[m.sender].premiumTime;
  const user = Object.entries(global.db.data.users).filter((user) => user[1].premiumTime).map(([key, value]) => {
    return {...value, jid: key};
  });
  const premTime = global.db.data.users[m.sender].premiumTime;
  const prem = global.db.data.users[m.sender].premium;
  const userr = await '@' + m.sender.split`@`[0];
  const waktu = clockString(`${premTime - new Date() * 1} `, tradutor);
  const sortedP = user.map(toNumber('premiumTime')).sort(sort('premiumTime'));
  const len = args[0] && args[0].length > 0 ? Math.min(100, Math.max(parseInt(args[0]), 10)) : Math.min(10, sortedP.length);
  
  let infoprem = `
${tradutor.text1[0]}

${tradutor.text1[1]} ${userr}
${prem ? `${tradutor.text1[2]} ${clockString(usuario - new Date() * 1, tradutor)}` : (isPrems ? `${tradutor.text1[3]}` : tradutor.text1[4])}

${tradutor.text1[5]} ${sortedP.slice(0, len).map(({jid, name, premiumTime, prem, registered}, i) => `

${tradutor.text1[6]} ${'@' + jid.split`@`[0]}
${premiumTime > 0 ? `${tradutor.text1[7]} ${clockString(premiumTime - new Date() * 1, tradutor)}` : tradutor.text1[8]}`).join('')}`.trim();

  if (sortedP.filter((user) => user.premiumTime).length === 0) {
    infoprem = `${tradutor.text2[0]} ${userr}\n${prem ? `${tradutor.text2[1]} ${clockString(usuario - new Date() * 1, tradutor)}` : tradutor.text2[2]}\n\n${tradutor.text2[3]}`.trim();
  }

  m.reply(infoprem, null, {mentions: conn.parseMention(infoprem)});
};

handler.help = ['premlist'];
handler.tags = ['info'];
handler.command = /^(listprem|premlist|listavip|viplista)$/i;
export default handler;

function clockString(ms, tradutor) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  
  return `${tradutor.text3[0]} ${years}\n${tradutor.text3[1]} ${months}\n${tradutor.text3[2]} ${weeks}\n${tradutor.text3[3]} ${days}\n${tradutor.text3[4]} ${hours % 24}\n${tradutor.text3[5]} ${minutes % 60}\n${tradutor.text3[6]} ${seconds % 60}`;
}

function sort(property, ascending = true) {
  if (property) return (...args) => args[ascending & 1][property] - args[!ascending & 1][property];
  else return (...args) => args[ascending & 1] - args[!ascending & 1];
}

function toNumber(property, _default = 0) {
  if (property) {
    return (a, i, b) => {
      return {...b[i], [property]: a[property] === undefined ? _default : a[property]};
    };
  } else return (a) => a === undefined ? _default : a;
}