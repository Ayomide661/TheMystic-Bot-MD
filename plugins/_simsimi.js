import translate from '@vitalets/google-translate-api';
import axios from 'axios';
import fetch from 'node-fetch';

const handler = (m) => m;

// List of commands/triggers to ignore
const IGNORED_KEYWORDS = [
  'serbot', 'bots', 'jadibot', 'menu', 'play', 'play2', 
  'playdoc', 'tiktok', 'facebook', 'menu2', 'infobot',
  'estado', 'ping', 'instalarbot', 'sc', 'sticker',
  's', 'wm', 'qc'
];

handler.before = async (m) => {
  const chat = global.db.data.chats[m.chat];
  if (!chat.simi) return true;
  
  // Skip if message is a command to disable simi
  if (/^.*false|disable|(turn)?off|0/i.test(m.text)) return;
  
  // Skip if message contains ignored keywords
  if (IGNORED_KEYWORDS.some(keyword => m.text.toLowerCase().includes(keyword))) {
    return;
  }

  try {
    // Try multiple chatbot APIs in sequence
    const response = await getChatbotResponse(m.text);
    await m.conn.sendMessage(m.chat, { text: response }, { quoted: m });
    return true;
  } catch (error) {
    console.error('Chatbot error:', error);
    // Don't send error message to avoid spamming
    return true;
  }
};

export default handler;

async function getChatbotResponse(text, language = 'es') {
  // Try different APIs in order of preference
  const apis = [
    tryOpenAI,
    tryGemini,
    tryDeepSeek,
    trySimsimi
  ];
  
  for (const api of apis) {
    try {
      const response = await api(text, language);
      if (response) return response;
    } catch (error) {
      console.warn(`API ${api.name} failed:`, error.message);
      // Continue to next API
    }
  }
  
  throw new Error('All chatbot APIs failed');
}

// Modern chatbot APIs
async function tryOpenAI(text, language) {
  // You would need to set up your OpenAI API key
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: "gpt-3.5-turbo",
      messages: [
        {role: "system", content: "You are a helpful assistant."},
        {role: "user", content: text}
      ],
      temperature: 0.7
    },
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  return response.data.choices[0].message.content;
}

async function tryGemini(text, language) {
  // Requires Google Gemini API key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  
  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
    {
      contents: [{
        parts: [{
          text: text
        }]
      }]
    }
  );
  
  return response.data.candidates[0].content.parts[0].text;
}

async function tryDeepSeek(text, language) {
  const response = await axios.post(
    'https://api.deepseek.com/v1/chat/completions',
    {
      model: "deepseek-chat",
      messages: [
        {role: "user", content: text}
      ]
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
  
  return response.data.choices[0].message.content;
}

// Fallback to Simsimi
async function trySimsimi(text, language) {
  try {
    // Try official Simsimi API first
    const response = await axios.get(
      `https://api.simsimi.net/v2/`, 
      {
        params: {
          text: text,
          lc: language,
          cf: false
        },
        headers: {
          'x-api-key': process.env.SIMSIMI_API_KEY || 'default_key'
        }
      }
    );
    return response.data.success;
  } catch {
    // Fallback to alternative APIs
    const fallbackApis = [
      `https://api.anbusec.xyz/api/v1/simitalk?apikey=iJ6FxuA9vxlvz5cKQCt3&ask=${encodeURIComponent(text)}&lc=${language}`,
      `https://deliriusapi-official.vercel.app/tools/simi?text=${encodeURIComponent(text)}`
    ];
    
    for (const apiUrl of fallbackApis) {
      try {
        const response = await axios.get(apiUrl);
        if (response.data?.message) {
          return response.data.message;
        }
      } catch (error) {
        continue;
      }
    }
    
    throw new Error('All Simsimi APIs failed');
  }
}