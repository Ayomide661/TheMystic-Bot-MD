import axios from 'axios';

// Enhanced Anime Character Database
const ANIME_CHARACTERS = {
  tsundere: {
    name: 'Tsun-Tsun',
    responses: [
      { trigger: ['hi', 'hello'], reply: 'Hmph. W-what do you want?' },
      { trigger: ['love', 'like'], reply: 'D-don’t misunderstand! I just tolerate you!' },
      { trigger: ['stupid', 'idiot'], reply: 'Who are you calling idiot, idiot?!' }
    ]
  },
  kuudere: {
    name: 'Kuro',
    responses: [
      { trigger: ['weather'], reply: 'The weather is irrelevant to our conversation.' },
      { trigger: ['alone'], reply: 'Solitude is preferable to meaningless chatter.' }
    ]
  },
  genki: {
    name: 'Neko-chan',
    responses: [
      { trigger: ['food'], reply: 'Nyaa~! Let\'s get ramen! (≧▽≦)' },
      { trigger: ['happy'], reply: 'Yay! Let\'s play together! ヽ(>∀<☆)ノ' }
    ]
  }
};

const handler = async (m, { conn }) => {
  const chat = global.db.data.chats[m.chat];
  if (!chat.animeai) return;

  try {
    const text = m.text.toLowerCase();
    
    // 1. Check local responses first
    for (const char of Object.values(ANIME_CHARACTERS)) {
      for (const r of char.responses) {
        if (r.trigger.some(t => text.includes(t))) {
          await conn.reply(m.chat, `${char.name}: ${r.reply}`, m);
          return;
        }
      }
    }

    // 2. Fallback to API
    const apiResponse = await getAnimeAPIResponse(text);
    await conn.reply(m.chat, apiResponse, m);
    
  } catch (error) {
    console.error('AnimeAI Error:', error);
    // Silent fail - don't spam chat with errors
  }
};

async function getAnimeAPIResponse(text) {
  try {
    // Try AnimeChan API first
    const { data } = await axios.get('https://animechan.xyz/api/random');
    return `${data.character} (${data.anime}): "${data.quote}"`;
    
  } catch {
    // Fallback to Waifu.pics
    try {
      const { data } = await axios.get('https://api.waifu.pics/sfw/neko');
      return `Neko-chan: Look at this cute neko! ${data.url}`;
      
    } catch {
      // Final fallback to local response
      const chars = Object.values(ANIME_CHARACTERS);
      const randomChar = chars[Math.floor(Math.random() * chars.length)];
      const randomResponse = randomChar.responses[Math.floor(Math.random() * randomChar.responses.length)];
      return `${randomChar.name}: ${randomResponse.reply}`;
    }
  }
}

// Enable/disable commands
handler.command = /^(animeai|disableanime)$/i;
handler.group = true;
export default handler;  const chat = global.db.data.chats[m.chat];
  if (!chat.animeai) return true;

  // Skip if message is a command to disable
  if (/^.*false|disable|(turn)?off|0/i.test(m.text)) return;

  // Skip ignored keywords
  if (IGNORED_KEYWORDS.some(keyword => m.text.toLowerCase().includes(keyword))) {
    return;
  }

  try {
    const response = await getAnimeResponse(m.text);
    await m.conn.sendMessage(m.chat, { text: response }, { quoted: m });
    return true;
  } catch (error) {
    console.error('AnimeAI error:', error);
    return true;
  }
};

async function getAnimeResponse(text) {
  // 1. Check local anime responses
  const lowerText = text.toLowerCase();
  for (const charType in ANIME_CHARACTERS) {
    const char = ANIME_CHARACTERS[charType];
    for (const r of char.responses) {
      if (r.trigger.some(t => lowerText.includes(t))) {
        return `${char.name}: ${r.reply}`;
      }
    }
  }

  // 2. Try anime-themed APIs in order
  const apis = [
    tryAnimeReactionsAPI,
    tryAnimeChanAPI,
    tryWaifuAPI
  ];

  for (const api of apis) {
    try {
      const response = await api(text);
      if (response) return response;
    } catch (error) {
      console.warn(`API ${api.name} failed:`, error.message);
    }
  }

  // 3. Final fallback
  return getRandomAnimeResponse();
}

// Anime-themed APIs
async function tryAnimeReactionsAPI(text) {
  const { data } = await axios.get(
    `https://api.anime-reactions.uzumaki-unofficial.workers.dev/chat?msg=${encodeURIComponent(text)}`
  );
  return data.response || null;
}

async function tryAnimeChanAPI() {
  const { data } = await axios.get('https://animechan.xyz/api/random');
  return `${data.character} (${data.anime}): "${data.quote}"`;
}

async function tryWaifuAPI(text) {
  const { data } = await axios.post(
    'https://api.waifu.pics/sfw/chat',
    { message: text }
  );
  return data.response;
}

function getRandomAnimeResponse() {
  const characters = Object.values(ANIME_CHARACTERS);
  const randomChar = characters[Math.floor(Math.random() * characters.length)];
  const responses = randomChar.responses.map(r => r.reply);
  return `${randomChar.name}: ${responses[Math.floor(Math.random() * responses.length)]}`;
}

// Enable/disable commands
handler.command = /^(animeai|disableanime)$/i;
handler.rowner = true;
export default handler;
