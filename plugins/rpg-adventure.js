import fetch from 'node-fetch';

const cooldown = 1500000; // 25 minutes
const handler = async (m, {usedPrefix, conn}) => {
  const datas = global
  const idioma = datas.db.data.users[m.sender].language || global.defaultLenguaje
  const _translate = JSON.parse(fs.readFileSync(`./src/languages/${idioma}.json`))
  const tradutor = _translate.plugins.rpg_adventure

  try {
    const ct = [
      'US', 'GB', 'JP', 'KR', 'BR', // More reliable countries
      'FR', 'DE', 'IT', 'ES', 'CA'  // for World Bank API
    ];
    
    // 1. Fetch country data with timeout
    const ke = await fetch(
      `https://api.worldbank.org/v2/country/${ct.getRandom()}?format=json`,
      { timeout: 5000 }
    ).catch(_ => null);
    
    // 2. Fallback if API fails
    const kt = ke ? await ke.json() : { 
      1: [{
        name: "Mystic Land",
        id: "ML",
        capitalCity: "Adventure City",
        longitude: "0°",
        latitude: "0°"
      }]
    };

    // 3. Image generation (fixed)
    const img = await conn.profilePictureUrl(m.sender, 'image')
      .catch(_ => 'https://i.imgur.com/8Km9tLL.jpg'); // Fallback image

    const user = global.db.data.users[m.sender];
    const timers = cooldown - (new Date() - user.lastadventure);
    
    if (user.health < 80) {
      return conn.reply(
        m.chat,
        `_${htki} ${tradutor.text1[0]} ${htka}_\n\n${tradutor.text1[1]}`,
        m,
      );
    }
    
    if (new Date() - user.lastadventure <= cooldown) {
      return conn.reply(
        m.chat,
        `${htki} ${tradutor.text2[0]} ${htka}\n\n${tradutor.text2[1]} ${new Date(timers).toISOString().substr(11, 8)} ${tradutor.text2[2]}`,
        m,
      );
    }

    // 4. Generate adventure card with image
    const rewards = reward(user);
    let text = `${tradutor.text2[3]} *» ${kt[1][0].name}*

${cmenut}
${cmenub} ${tradutor.text3[0]} ${kt[1][0].id}
${cmenub} ${tradutor.text3[1]} ${kt[1][0].capitalCity}
${cmenub} ${tradutor.text3[2]} ${kt[1][0].longitude}
${cmenub} ${tradutor.text3[3]} ${kt[1][0].latitude}
${cmenuf}

${tradutor.text3[4]}
${cmenua}`;

    // Reward processing (unchanged)
    for (const lost in rewards.lost) {
      if (user[lost]) {
        const total = rewards.lost[lost].getRandom();
        user[lost] -= total * 1;
        if (total) text += `\n${global.rpg.emoticon(lost)} ${total}`;
      }
    }
    text += tradutor.text4;
    for (const rewardItem in rewards.reward) {
      if (rewardItem in user) {
        const total = rewards.reward[rewardItem].getRandom();
        user[rewardItem] += total * 1;
        if (total) text += `\n» ${global.rpg.emoticon(rewardItem)} ${total}`;
      }
    }
    
    // 5. Send message with image
    await conn.sendFile(m.chat, img, 'adventure.jpg', 
      `${htki} ${tradutor.text5[0]} ${htka}\n\n${text}`, 
      m, null, { mentions: [m.sender] }
    );
    
    user.lastadventure = new Date() * 1;
    
  } catch (e) {
    console.error('Adventure error:', e);
    conn.reply(
      m.chat,
      `${tradutor.text5[1]}`,
      m,
    );
  }
};

// Keep original reward function and handler properties
handler.help = ['adventure'];
handler.tags = ['xp'];
handler.command = /^(adventure|adv|aventura|aventurar)$/i;
handler.cooldown = cooldown;
handler.disabled = false;
export default handler;

function reward(user = {}) {
  const rewards = {
    reward: {
      money: 400,
      exp: 300,
      trash: 150,
      potion: 3,
      rock: 2,
      joincount: 2,
      wood: 3,
      string: 2,
      common: 2 * ((user.dog && (user.dog > 2 ? 2 : user.dog) * 1.2) || 1),
      uncoommon: [0, 0, 0, 1, 0].concat(
          new Array(
              5 -
            ((user.dog > 2 && user.dog < 6 && user.dog) ||
              (user.dog > 5 && 5) ||
              2),
          ).fill(0),
      ),
      mythic: [0, 0, 0, 0, 0, 1, 0, 0, 0].concat(
          new Array(
              8 -
            ((user.dog > 5 && user.dog < 8 && user.dog) ||
              (user.dog > 7 && 8) ||
              3),
          ).fill(0),
      ),
      legendary: [0, 0, 0, 0, 0, 0, 0, 1, 0, 0].concat(
          new Array(10 - ((user.dog > 8 && user.dog) || 4)).fill(0),
      ),
      cat: [0, 1, 0, 0, 0],
      centaur: [0, 1, 0, 0, 0],
      dog: [0, 1, 0, 0, 0],
      dragon: [0, 1, 0, 0, 0],
      emerald: [0, 1, 0, 0, 0],
      fox: [0, 1, 0, 0, 0],
      griffin: [0, 1, 0, 0, 0],
      horse: [0, 1, 0, 0, 0],
      kyubi: [0, 1, 0, 0, 0],
      lion: [0, 1, 0, 0, 0],
      pet: [0, 1, 0, 0, 0],
      phonix: [0, 1, 0, 0, 0],
      rhinoceros: [0, 1, 0, 0, 0],
      robo: [0, 1, 0, 0, 0],
      wolf: [0, 1, 0, 0, 0],
      iron: [0, 0, 0, 1, 0, 0],
      gold: [0, 0, 0, 0, 0, 1, 0],
      diamond: [0, 0, 0, 0, 0, 0, 1, 0].concat(
          new Array(
              5 - ((user.fox < 6 && user.fox) || (user.fox > 5 && 5) || 0),
          ).fill(0),
      ),
    },
    lost: {
      health: 101 - user.cat * 4,
      armordurability: (15 - user.armor) * 7,
    },
  };
  return rewards;
}
