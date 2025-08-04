const toM = (a) => '@' + a.split('@')[0];
function handler(m, {groupMetadata}) {
  const ps = groupMetadata.participants.map((v) => v.id);
  const a = ps.getRandom();
  let b;
  do b = ps.getRandom();
  while (b === a);
  m.reply(`*${toM(a)}, you should date ${toM(b)}, you two look perfect together!*`, null, {
    mentions: [a, b],
  });
}
handler.help = ['matchmake'];
handler.tags = ['game'];
handler.command = ['matchmake', 'matchmaker', 'pairup', 'ship'];
handler.group = true;
export default handler;