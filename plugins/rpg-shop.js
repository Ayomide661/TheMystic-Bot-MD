import fs from 'fs';

const xpperlimit = 350;

const handler = async (m, { conn, command, args }) => {
  try {
    const datas = global;
    const idioma = datas.db.data.users[m.sender].language || global.defaultLenguaje;
    const _translate = JSON.parse(fs.readFileSync(`./src/languages/${idioma}.json`));
    const tradutor = _translate.plugins.rpg_shop || {};

    if (!args[0] || args[0] === 'list') {
      return showShop(m, conn, tradutor);
    }

    const itemKey = args[0].toLowerCase();
    const item = global.rpgshop.getItem(itemKey);

    if (!item) {
      const notFoundMsg = tradutor.text4 
        ? tradutor.text4.replace('{}', itemKey) 
        : `Item "${itemKey}" not found in the shop!`;
      return conn.reply(m.chat, notFoundMsg, m);
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

      const successMsg = [
        tradutor.text1?.[0] || 'Purchase successful!',
        `${tradutor.text1?.[1] || 'You obtained'} : + ${count} ${item.name}`,
        `${tradutor.text1?.[2] || 'XP deducted'} -${totalCost} XP`,
        tradutor.text1?.[3] || 'Thank you for your purchase!'
      ].join('\n');

      conn.reply(m.chat, successMsg, m);
    } else {
      const failMsg = `${tradutor.text2 || "You don't have enough XP to buy"} *${count}* ${item.name} ${
        tradutor.text3 || 'You need more XP!'
      }`;
      conn.reply(m.chat, failMsg, m);
    }
  } catch (error) {
    console.error('Error in shop handler:', error);
    conn.reply(m.chat, 'An error occurred while processing your request.', m);
  }
};

async function showShop(m, conn, tradutor) {
  const itemsByCategory = {};
  const defaultCategories = {
    currency: '💰 CURRENCY',
    resource: '🛠️ RESOURCES',
    consumable: '🥤 CONSUMABLES',
    tool: '⚒️ TOOLS',
    box: '📦 BOXES',
    pet: '🐾 PETS',
    plant: '🌿 PLANTS',
    seed: '🌱 SEEDS',
    special: '🎯 SPECIAL'
  };

  global.rpgshop.listItems().forEach(item => {
    if (!itemsByCategory[item.type]) {
      itemsByCategory[item.type] = [];
    }
    itemsByCategory[item.type].push(item);
  });

  let shopMessage = `${tradutor.shopTitle || '🏪 RPG SHOP 🏪'}\n\n`;

  for (const [category, items] of Object.entries(itemsByCategory)) {
    const categoryName = (tradutor.categories && tradutor.categories[category]) || 
                        defaultCategories[category] || 
                        category.toUpperCase();
    
    shopMessage += `*${categoryName}*\n`;
    shopMessage += items.map(item => 
      `➠ ${item.name} (${item.id}): ${item.price} XP`
    ).join('\n');
    shopMessage += '\n\n';
  }

  shopMessage += tradutor.shopHelp || 'Type /buy <item> [amount] to purchase items';
  conn.reply(m.chat, shopMessage, m);
}

handler.help = ['buy <item> [amount]', 'buy list', 'shop'];
handler.tags = ['rpg'];
handler.command = ['buy', 'buyall', 'shop'];
handler.disabled = false;

export default handler;