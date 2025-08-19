import axios from 'axios';
import translate from '@vitalets/google-translate-api';
import { AnimeQuote } from 'animequotes';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  // Anime character database (local fallback)
  const animeCharacters = {
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
    }
  };

  // Random anime quote fallback
  const getAnimeQuote = async () => {
    const quote = await AnimeQuote.randomQuote();
    return `${quote.character} (${quote.anime}): "${quote.quote}"`;
  };

  // 1. Try local anime responses first
  const lowerText = text.toLowerCase();
  let response;

  for (const charType in animeCharacters) {
    const char = animeCharacters[charType];
    for (const r of char.responses) {
      if (r.trigger.some(t => lowerText.includes(t))) {
        response = `${char.name}: ${r.reply}`;
        break;
      }
    }
  }

  // 2. Fallback to AI APIs (Anime-style)
  if (!response) {
    try {
      // Option 1: Anime-themed API
      const { data } = await axios.get(`https://api.anime-reactions.uzumaki-unofficial.workers.dev/chat?msg=${encodeURIComponent(text)}`);
      response = data.response;

      // Option 2: Local quote if API fails
      if (!response) response = await getAnimeQuote();
    } catch (e) {
      response = `*${animeCharacters.tsundere.name}*: Urusai! (I-I’m busy right now!)`;
    }
  }

  // Optional: Add text-to-speech (Japanese voice)
  /*
  const tts = await conn.tts(response, 'ja');
  conn.sendMessage(m.chat, 
    { audio: tts, mimetype: 'audio/mpeg' }, 
    { quoted: m, ptt: true }
  );
  */

  // Send text response
  conn.reply(m.chat, response, m);
};

handler.help = ['animeai <text>'];
handler.tags = ['anime'];
handler.command = /^(animebot|animeai|senpai|baka)$/i;
export default handler;    } catch {
        try {
            const response2 = await axios.get(`https://api.anbusec.xyz/api/v1/simitalk?apikey=${apikeyyy}&ask=${ask}&lc=${language}`);
            return { status: true, resultado: { simsimi: response2.data.message }};       
        } catch (error2) {
            return { status: false, resultado: { msg: "Todas las API's fallarón. Inténtalo de nuevo más tarde.", error: error2.message }};
        }
    }
}}
