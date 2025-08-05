import {watchFile, unwatchFile} from 'fs';
import chalk from 'chalk';
import {fileURLToPath} from 'url';
import fs from 'fs';
import cheerio from 'cheerio';
import fetch from 'node-fetch';
import axios from 'axios';
import moment from 'moment-timezone';

/* API Configuration */
global.openai_key = 'sk-0';
global.openai_org_id = 'org-3';
global.MyApiRestBaseUrl = 'https://api.cafirexos.com';
global.MyApiRestApikey = 'BrunoSobrino';
global.MyApiRestBaseUrl2 = 'https://api-brunosobrino-dcaf9040.koyeb.app';
global.MyApiRestBaseUrl3 = 'https://api-brunosobrino.onrender.com'; 

/* API Keys */
global.keysZens = ['LuOlangNgentot', 'c2459db922', '37CC845916', '6fb0eff124', 'hdiiofficial', 'fiktod', 'BF39D349845E', '675e34de8a', '0b917b905e6f'];
global.keysxxx = keysZens[Math.floor(keysZens.length * Math.random())];
global.keysxteammm = ['29d4b59a4aa687ca', '5LTV57azwaid7dXfz5fzJu', 'cb15ed422c71a2fb', '5bd33b276d41d6b4', 'HIRO', 'kurrxd09', 'ebb6251cc00f9c63'];
global.keysxteam = keysxteammm[Math.floor(keysxteammm.length * Math.random())];
global.keysneoxrrr = ['5VC9rvNx', 'cfALv5'];
global.keysneoxr = keysneoxrrr[Math.floor(keysneoxrrr.length * Math.random())];
global.lolkeysapi = ['GataDiosV3'];
global.itsrose = ['4b146102c4d500809da9d1ff'];

/* API Endpoints */
global.APIs = {
  CFROSAPI: 'https://api.cafirexos.com',
  xteam: 'https://api.xteam.xyz',
  stellar: 'https://api.stellarwa.xyz',
  dzx: 'https://api.dhamzxploit.my.id',
  lol: 'https://api.lolhuman.xyz',
  neoxr: 'https://api.neoxr.my.id',
  zenzapis: 'https://api.zahwazein.xyz',
  akuari: 'https://api.akuari.my.id',
  akuari2: 'https://apimu.my.id',
  fgmods: 'https://api-fgmods.ddns.net',
  botcahx: 'https://api.botcahx.biz.id',
  ibeng: 'https://api.ibeng.tech/docs',
  rose: 'https://api.itsrose.site',
  popcat: 'https://api.popcat.xyz',
  xcoders: 'https://api-xcoders.site',
  vihangayt: 'https://vihangayt.me',
  erdwpe: 'https://api.erdwpe.com',
  xyroinee: 'https://api.xyroinee.xyz',
  nekobot: 'https://nekobot.xyz',
  BK9: 'https://apii.bk9.site'
};

global.APIKeys = {
  'https://api.xteam.xyz': `${keysxteam}`,
  'https://api.stellarwa.xyz': `BrunoSobrino`,
  'https://api.lolhuman.xyz': 'GataDios',
  'https://api.neoxr.my.id': `${keysneoxr}`,
  'https://api.zahwazein.xyz': `${keysxxx}`,
  'https://api-fgmods.ddns.net': 'fg-dylux',
  'https://api.botcahx.biz.id': 'Admin',
  'https://api.ibeng.tech/docs': 'tamvan',
  'https://api.itsrose.site': 'Rs-Zeltoria',
  'https://api-xcoders.site': 'Frieren',
  'https://api.xyroinee.xyz': 'uwgflzFEh6',
  'https://apikasu.onrender.com': 'ApiKey'
};

/** Global Utilities **/
global.cheerio = cheerio;
global.fs = fs;
global.fetch = fetch;
global.axios = axios;
global.moment = moment;

/** RPG System **/
global.rpg = {
  emoticon(string) {
    string = string.toLowerCase();
    const emot = {
      level: '🧬 Level',
      limit: '💎 Diamond',
      exp: '⚡ Experience',
      bank: '🏦 Bank',
      diamond: '💎 Diamond',
      health: '❤️ Health',
      kyubi: '🌀 Magic',
      joincount: '🪙 Token',
      emerald: '💚 Emerald',
      stamina: '✨ Energy',
      role: '💪 Rank',
      premium: '🎟️ Premium',
      pointxp: '📧 Exp Points',
      gold: '👑 Gold',
      trash: '🗑 Trash',
      crystal: '🔮 Crystal',
      intelligence: '🧠 Intelligence',
      string: '🕸️ String',
      keygold: '🔑 Gold Key',
      keyiron: '🗝️ Iron Key',
      emas: '🪅 Piñata',
      fishingrod: '🎣 Fishing Rod',
      gems: '🍀 Gems',
      magicwand: '⚕️ Magic Wand',
      mana: '🪄 Spell',
      agility: '🤸‍♂️ Agility',
      darkcrystal: '♠️ Dark Crystal',
      iron: '⛓️ Iron',
      rock: '🪨 Rock',
      potion: '🥤 Potion',
      superior: '💼 Superior',
      robo: '🚔 Robo',
      upgrader: '🧰 Upgrade Boost',
      wood: '🪵 Wood',
      strength: '🦹‍♀️ Strength',
      arc: '🏹 Bow',
      armor: '🥼 Armor',
      bow: '🏹 Super Bow',
      pickaxe: '⛏️ Pickaxe',
      sword: '⚔️ Sword',
      common: '📦 Common Box',
      uncoommon: '🥡 Uncommon Box',
      mythic: '🗳️ Mythic Box',
      legendary: '🎁 Legendary Box',
      petFood: '🍖 Pet Food',
      pet: '🍱 Pet Box',
      bibitanggur: '🍇 Grape Seed',
      bibitapel: '🍎 Apple Seed',
      bibitjeruk: '🍊 Orange Seeds',
      bibitmangga: '🥭 Mango Seed',
      bibitpisang: '🍌 Banana Seeds',
      ayam: '🐓 Chicken',
      babi: '🐖 Pig',
      Jabali: '🐗 Wild Boar',
      bull: '🐃 Bull',
      buaya: '🐊 Crocodile',
      cat: '🐈 Cat',
      centaur: '🐐 Centaur',
      chicken: '🐓 Chicken',
      cow: '🐄 Cow',
      dog: '🐕 Dog',
      dragon: '🐉 Dragon',
      elephant: '🐘 Elephant',
      fox: '🦊 Fox',
      giraffe: '🦒 Giraffe',
      griffin: '🦅 Bird',
      horse: '🐎 Horse',
      kambing: '🐐 Goat',
      kerbau: '🐃 Buffalo',
      lion: '🦁 Lion',
      money: '👾 MysticCoins',
      monyet: '🐒 Monkey',
      panda: '🐼 Panda',
      snake: '🐍 Snake',
      phonix: '🕊️ Phoenix',
      rhinoceros: '🦏 Rhinoceros',
      wolf: '🐺 Wolf',
      tiger: '🐅 Tiger',
      cumi: '🦑 Squid',
      udang: '🦐 Shrimp',
      ikan: '🐟 Fish',
      fideos: '🍝 Noodles',
      ramuan: '🧪 NOVA Ingredient',
      knife: '🔪 Knife'
    };
    const results = Object.keys(emot).map((v) => [v, new RegExp(v, 'gi')]).filter((v) => v[1].test(string));
    return results.length ? emot[results[0][0]] : '';
  }
};

global.rpgg = {
  emoticon(string) {
    string = string.toLowerCase();
    const emott = {
      level: '🧬',
      limit: '💎',
      exp: '⚡',
      bank: '🏦',
      diamond: '💎+',
      health: '❤️',
      kyubi: '🌀',
      joincount: '🪙',
      emerald: '💚',
      stamina: '✨',
      role: '💪',
      premium: '🎟️',
      pointxp: '📧',
      gold: '👑',
      trash: '🗑',
      crystal: '🔮',
      intelligence: '🧠',
      string: '🕸️',
      keygold: '🔑',
      keyiron: '🗝️',
      emas: '🪅',
      fishingrod: '🎣',
      gems: '🍀',
      magicwand: '⚕️',
      mana: '🪄',
      agility: '🤸‍♂️',
      darkcrystal: '♠️',
      iron: '⛓️',
      rock: '🪨',
      potion: '🥤',
      superior: '💼',
      robo: '🚔',
      upgrader: '🧰',
      wood: '🪵',
      strength: '🦹‍♀️',
      arc: '🏹',
      armor: '🥼',
      bow: '🏹',
      pickaxe: '⛏️',
      sword: '⚔️',
      common: '📦',
      uncoommon: '🥡',
      mythic: '🗳️',
      legendary: '🎁',
      petFood: '🍖',
      pet: '🍱',
      bibitanggur: '🍇',
      bibitapel: '🍎',
      bibitjeruk: '🍊',
      bibitmangga: '🥭',
      bibitpisang: '🍌',
      ayam: '🐓',
      babi: '🐖',
      Jabali: '🐗',
      bull: '🐃',
      buaya: '🐊',
      cat: '🐈',
      centaur: '🐐',
      chicken: '🐓',
      cow: '🐄',
      dog: '🐕',
      dragon: '🐉',
      elephant: '🐘',
      fox: '🦊',
      giraffe: '🦒',
      griffin: '🦅',
      horse: '🐎',
      kambing: '🐐',
      kerbau: '🐃',
      lion: '🦁',
      money: '👾',
      monyet: '🐒',
      panda: '🐼',
      snake: '🐍',
      phonix: '🕊️',
      rhinoceros: '🦏',
      wolf: '🐺',
      tiger: '🐅',
      cumi: '🦑',
      udang: '🦐',
      ikan: '🐟',
      fideos: '🍝',
      ramuan: '🧪',
      knife: '🔪'
    };
    const results = Object.keys(emott).map((v) => [v, new RegExp(v, 'gi')]).filter((v) => v[1].test(string));
    return results.length ? emott[results[0][0]] : '';
  }
};

global.rpgshop = {
  getItem(item) {
    item = item.toLowerCase();
    return this.items[item] || null;
  },
  
  listItems(category) {
    if (category) {
      return Object.entries(this.items)
        .filter(([_, item]) => item.type === category)
        .map(([key, item]) => ({ id: key, ...item }));
    }
    return Object.entries(this.items).map(([key, item]) => ({ id: key, ...item }));
  },

  items: {
    limit: { name: '💎 Diamond', price: 350, type: 'currency' },
    diamond: { name: '💎 Diamond', price: 350, type: 'currency' },
    joincount: { name: '🪙 Token', price: 200, type: 'currency' },
    money: { name: '👾 MysticCoins', price: 150, type: 'currency' },
    tiketcoin: { name: '🎫 Mystic Tickets', price: 500, type: 'currency' },
    emerald: { name: '💚 Emerald', price: 300, type: 'currency' },
    berlian: { name: '♦️ Jewel', price: 400, type: 'currency' },
    kyubi: { name: '🌀 Magic', price: 450, type: 'currency' },
    gold: { name: '👑 Gold', price: 250, type: 'currency' },
    wood: { name: '🪵 Wood', price: 100, type: 'resource' },
    rock: { name: '🪨 Rock', price: 120, type: 'resource' },
    iron: { name: '⛓️ Iron', price: 250, type: 'resource' },
    coal: { name: '⚱️ Coal', price: 180, type: 'resource' },
    string: { name: '🕸️ String', price: 150, type: 'resource' },
    trash: { name: '🗑 Trash', price: 50, type: 'resource' },
    batu: { name: '🥌 Stone', price: 130, type: 'resource' },
    botol: { name: '🍶 Bottle', price: 80, type: 'resource' },
    kaleng: { name: '🥫 Can', price: 70, type: 'resource' },
    kardus: { name: '🪧 Cardboard', price: 60, type: 'resource' },
    emasbatang: { name: '〽️ Gold Bar', price: 800, type: 'resource' },
    emasbiasa: { name: '🧭 Common Gold', price: 600, type: 'resource' },
    eleksirb: { name: '💡 Electricity', price: 700, type: 'resource' },
    kayu: { name: '🛷 Super Wood', price: 500, type: 'resource' },
    potion: { name: '🥤 Potion', price: 200, type: 'consumable' },
    stamina: { name: '✨ Energy', price: 150, type: 'consumable' },
    aqua: { name: '💧 Water', price: 100, type: 'consumable' },
    petFood: { name: '🍖 Pet Food', price: 300, type: 'consumable' },
    makananpet: { name: '🍱🥩 Pet Foods', price: 350, type: 'consumable' },
    makanancentaur: { name: '🐐🥩 Centaur Food', price: 400, type: 'consumable' },
    makanangriffin: { name: '🦅🥩 Bird Food', price: 400, type: 'consumable' },
    makanankyubi: { name: '🌀🥩 Magic Food', price: 450, type: 'consumable' },
    makanannaga: { name: '🐉🥩 Dragon Food', price: 500, type: 'consumable' },
    makananphonix: { name: '🕊️🥩 Phoenix Food', price: 450, type: 'consumable' },
    sword: { name: '⚔️ Sword', price: 1000, type: 'tool' },
    pancing: { name: '🎣 Fishing Rod', price: 750, type: 'tool' },
    pancingan: { name: '🪝 Hook', price: 300, type: 'tool' },
    umpan: { name: '🪱 Bait', price: 150, type: 'tool' },
    pickaxe: { name: '⛏️ Pickaxe', price: 600, type: 'tool' },
    armor: { name: '🥼 Armor', price: 1200, type: 'tool' },
    bow: { name: '🏹 Bow', price: 900, type: 'tool' },
    magicwand: { name: '⚕️ Magic Wand', price: 1500, type: 'tool' },
    common: { name: '📦 Common Box', price: 400, type: 'box' },
    uncommon: { name: '🥡 Uncommon Box', price: 800, type: 'box' },
    mythic: { name: '🗳️ Mythic Box', price: 1500, type: 'box' },
    legendary: { name: '🎁 Legendary Box', price: 3000, type: 'box' },
    pet: { name: '📫 Pet Box', price: 2000, type: 'box' },
    gardenboxs: { name: '💐 Garden Box', price: 1200, type: 'box' },
    kucing: { name: '🐈 Cat', price: 2500, type: 'pet' },
    fox: { name: '🦊 Fox', price: 3000, type: 'pet' },
    wolf: { name: '🐺 Wolf', price: 3500, type: 'pet' },
    centaur: { name: '🐐 Centaur', price: 4000, type: 'pet' },
    griffin: { name: '🦅 Bird', price: 4500, type: 'pet' },
    naga: { name: '🐉 Dragon', price: 5000, type: 'pet' },
    kuda: { name: '🐎 Horse', price: 3000, type: 'pet' },
    phonix: { name: '🕊️ Phoenix', price: 4500, type: 'pet' },
    anjing: { name: '🐶 Dog', price: 2500, type: 'pet' },
    rubah: { name: '🦊🌫️ Great Fox', price: 5000, type: 'pet' },
    serigala: { name: '🐺🌫️ Super Wolf', price: 5500, type: 'pet' },
    anggur: { name: '🍇 Grape', price: 300, type: 'plant' },
    apel: { name: '🍎 Apple', price: 350, type: 'plant' },
    jeruk: { name: '🍊 Orange', price: 320, type: 'plant' },
    mangga: { name: '🥭 Mango', price: 380, type: 'plant' },
    pisang: { name: '🍌 Banana', price: 300, type: 'plant' },
    bibitanggur: { name: '🌾🍇 Grape Seeds', price: 150, type: 'seed' },
    bibitapel: { name: '🌾🍎 Apple Seeds', price: 180, type: 'seed' },
    bibitjeruk: { name: '🌾🍊 Orange Seeds', price: 160, type: 'seed' },
    bibitmangga: { name: '🌾🥭 Mango Seeds', price: 200, type: 'seed' },
    bibitpisang: { name: '🌾🍌 Banana Seeds', price: 150, type: 'seed' },
    healtmonster: { name: '💵 Bills', price: 1000, type: 'special' },
    emas: { name: '🪅 Piñata', price: 1200, type: 'special' },
    sampah: { name: '🗑🌫️ Super Trash', price: 800, type: 'special' },
    exp: { name: '⚡ Experience', price: 500, type: 'special' }
  },

  emoticon(string) {
    string = string.toLowerCase();
    const item = this.getItem(string);
    return item ? item.name : '';
  }
};

global.rpgshopp = {
  emoticon(string) {
    string = string.toLowerCase();
    const emotttt = {
      exp: '⚡',
      limit: '💎',
      diamond: '💎+',
      joincount: '🪙',
      emerald: '💚',
      berlian: '♦️',
      kyubi: '🌀',
      gold: '👑',
      money: '👾',
      tiketcoin: '🎫',
      stamina: '✨',
      potion: '🥤',
      aqua: '💧',
      trash: '🗑',
      wood: '🪵',
      rock: '🪨',
      batu: '🥌',
      string: '🕸️',
      iron: '⛓️',
      coal: '⚱️',
      botol: '🍶',
      kaleng: '🥫',
      kardus: '🪧',
      eleksirb: '💡',
      emasbatang: '〽️',
      emasbiasa: '🧭',
      rubah: '🦊🌫️',
      sampah: '🗑🌫️',
      serigala: '🐺🌫️',
      kayu: '🛷',
      sword: '⚔️',
      umpan: '🪱',
      healtmonster: '💵',
      emas: '🪅',
      pancingan: '🪝',
      pancing: '🎣',
      common: '📦',
      uncoommon: '🥡',
      mythic: '🗳️',
      pet: '📫',
      gardenboxs: '💐',
      legendary: '🎁',
      anggur: '🍇',
      apel: '🍎',
      jeruk: '🍊',
      mangga: '🥭',
      pisang: '🍌',
      bibitanggur: '🌾🍇',
      bibitapel: '🌾🍎',
      bibitjeruk: '🌾🍊',
      bibitmangga: '🌾🥭',
      bibitpisang: '🌾🍌',
      centaur: '🐐',
      griffin: '🦅',
      kucing: '🐈',
      naga: '🐉',
      fox: '🦊',
      kuda: '🐎',
      phonix: '🕊️',
      wolf: '🐺',
      anjing: '🐶',
      petFood: '🍖',
      makanancentaur: '🐐🥩',
      makanangriffin: '🦅🥩',
      makanankyubi: '🌀🥩',
      makanannaga: '🐉🥩',
      makananpet: '🍱🥩',
      makananphonix: '🕊️🥩'
    };
    const results = Object.keys(emotttt).map((v) => [v, new RegExp(v, 'gi')]).filter((v) => v[1].test(string));
    return results.length ? emotttt[results[0][0]] : '';
  }
};

/* File Watcher */
const file = fileURLToPath(import.meta.url);
watchFile(file, () => {
  unwatchFile(file);
  console.log(chalk.redBright('Updated \'api.js\''));
  import(`${file}?update=${Date.now()}`);
});