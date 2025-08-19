import axios from 'axios';
import { AnimeQuote } from 'animequotes';

// Anime Character Database
const ANIME_CHARACTERS = {
  tsundere: {
    name: 'Tsun-Tsun',
    greet: 'B-baka! It’s not like I wanted to talk to you or anything!',
    responses: [
      { trigger: ['hi', 'hello'], reply: 'Hmph. W-what do you want?' },
      { trigger: ['love', 'like'], reply: 'D-don’t misunderstand! I just tolerate you!' },
      { trigger: ['stupid', 'idiot'], reply: 'Who are you calling idiot, idiot?!' }
    ]
  },
  kuudere: {
    name: 'Cool-san',
    greet: '...Oh. You’re here.',
    responses: [
      { trigger: ['weather'], reply: 'The weather is irrelevant to our conversation.' },
      { trigger: ['alone'], reply: 'Solitude is preferable to meaningless chatter.' }
    ]
  },
  // Add more archetypes here
};

// List of commands/triggers to ignore
const IGNORED_KEYWORDS = [
  'serbot', 'bots', 'jadibot', 'menu', 'play', 'play2', 
  'playdoc', 'tiktok', 'facebook', 'menu2', 'infobot',
  'estado', 'ping', 'instalarbot', 'sc', 'sticker',
  's', 'wm', 'qc'
];

const handler = (m) => m;

handler.before = async (m) => {
  const chat = global.db.data.chats[m.chat];
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
