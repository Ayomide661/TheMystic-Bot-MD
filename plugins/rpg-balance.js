import fs from 'fs';

const handler = async (m, { usedPrefix }) => {
  const datas = global;
  const idioma = datas.db.data.users[m.sender].language || global.defaultLenguaje;
  const _translate = JSON.parse(fs.readFileSync(`./src/languages/${idioma}.json`));
  const translator = _translate.plugins.rpg_balance;

  let who;
  if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.sender;
  else who = m.sender;

  const name = conn.getName(who);
  const user = global.db.data.users[who];
  
  // Format large numbers
  const format = (number) => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  
  // Get item display name
  const getItemName = (item) => {
    const shopItem = global.rpgshop.getItem(item);
    return shopItem ? shopItem.name : `${item}`;
  };

  // Main currency balance
  let balanceMsg = `
${translator.text1[0]}
${translator.text1[1]} ${name}
${translator.text1[2]} ${format(user.limit || 0)}💎
${translator.text1[3]} ${format(user.exp || 0)} XP
${translator.text1[4]} ${format(user.money || 0)}👾
${translator.text1[5]}\n`;

  // Inventory categories
  const categories = {
    currency: ['emerald', 'berlian', 'kyubi', 'gold', 'tiketcoin', 'joincount'],
    resources: ['wood', 'rock', 'iron', 'coal', 'string', 'trash', 'batu', 'botol', 'kaleng', 'kardus', 
               'emasbatang', 'emasbiasa', 'eleksirb', 'kayu'],
    consumables: ['potion', 'stamina', 'aqua', 'petFood', 'makananpet', 'makanancentaur', 
                 'makanangriffin', 'makanankyubi', 'makanannaga', 'makananphonix'],
    tools: ['sword', 'pancing', 'pancingan', 'umpan', 'pickaxe', 'armor', 'bow', 'magicwand'],
    boxes: ['common', 'uncommon', 'mythic', 'legendary', 'pet', 'gardenboxs'],
    pets: ['kucing', 'fox', 'wolf', 'centaur', 'griffin', 'naga', 'kuda', 'phonix', 'anjing', 'rubah', 'serigala'],
    plants: ['anggur', 'apel', 'jeruk', 'mangga', 'pisang'],
    seeds: ['bibitanggur', 'bibitapel', 'bibitjeruk', 'bibitmangga', 'bibitpisang'],
    special: ['healtmonster', 'emas', 'sampah']
  };

  // Generate inventory display
  let inventoryMsg = `\n*${translator.inventoryTitle || '📦 INVENTORY'}*\n`;
  
  for (const [category, items] of Object.entries(categories)) {
    const categoryItems = items
      .filter(item => user[item] > 0)
      .map(item => `${getItemName(item)}: ${format(user[item] || 0)}`)
      .join(', ');
    
    if (categoryItems) {
      inventoryMsg += `\n*${category.toUpperCase()}*\n${categoryItems}\n`;
    }
  }

  // Combine messages
  const fullMessage = balanceMsg + inventoryMsg + `
❏ *${usedPrefix}buy* ${translator.text1[6] || 'item'}
❏ *${usedPrefix}buyall* ${translator.text1[7] || 'max amount'}
❏ *${usedPrefix}inventory* ${translator.text1[8] || 'detailed inventory'}`;

  m.reply(fullMessage);
};

handler.help = ['bal', 'balance'];
handler.tags = ['rpg'];
handler.command = ['bal', 'diamonds', 'diamond', 'balance'];
export default handler;