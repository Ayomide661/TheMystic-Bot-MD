import fs from 'fs';

const xpperlimit = 350; // Default price if item doesn't have one

const handler = async (m, { conn, command, args }) => {
  const datas = global;
  const idioma = datas.db.data.users[m.sender].language || global.defaultLenguaje;
  const _translate = JSON.parse(fs.readFileSync(`./src/languages/${idioma}.json`));
  const tradutor = _translate.plugins.rpg_shop;

  // Show shop if no arguments
  if (!args[0] || args[0] === 'list') {
    return showShop(m, conn, tradutor);
  }

  const itemKey = args[0].toLowerCase();
  const item = global.rpgshop.getItem(itemKey);

  if (!item) {
    return conn.reply(m.chat, tradutor.texto4.replace('{}', itemKey), m);
  }

  let count = command.replace(/^buy/i, '');
  count = count ? /all/i.test(count) ? 
    Math.floor(global.db.data.users[m.sender].exp / (item.price || xpperlimit)) : 
    parseInt(count) : 
    args[1] ? parseInt(args[1]) : 1;
  count = Math.max(1, count);

  const totalCost = (item.price || xpperlimit) * count;

  if (global.db.data.users[m.sender].exp >= totalCost) {
    global.db.data.users[m.sender].exp -= totalCost;
    global.db.data.users[m.sender][itemKey] = (global.db.data.users[m.sender][itemKey] || 0) + count;

    conn.reply(m.chat, `
${tradutor.texto1[0]}
${tradutor.texto1[1]} : + ${count} ${item.name} 
${tradutor.texto1[2]} -${totalCost} XP
${tradutor.texto1[3]}`, m);
  } else {
    conn.reply(m.chat, `${tradutor.texto2} *${count}* ${item.name} ${tradutor.texto3}`, m);
  }
};

async function showShop(m, conn, tradutor) {
  const itemsByCategory = {};

  // Group items by category
  global.rpgshop.listItems().forEach(item => {
    if (!itemsByCategory[item.type]) {
      itemsByCategory[item.type] = [];
    }
    itemsByCategory[item.type].push(item);
  });

  // Build shop message
  let shopMessage = `${tradutor.shopTitle}\n\n`;

  for (const [category, items] of Object.entries(itemsByCategory)) {
    shopMessage += `*${tradutor.categories[category] || category.toUpperCase()}*\n`;
    shopMessage += items.map(item => 
      `➠ ${item.name} (${item.id}): ${item.price} XP`
    ).join('\n');
    shopMessage += '\n\n';
  }

  shopMessage += tradutor.shopHelp;

  conn.reply(m.chat, shopMessage, m);
}

handler.help = ['buy <item> [amount]', 'buy list', 'shop'];
handler.tags = ['rpg'];
handler.command = ['buy', 'buyall', 'shop'];

handler.disabled = false;

export default handler;