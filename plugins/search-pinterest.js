/* 
/////////////////////////////////

 ☆ Code created by: GabrielZks
 ☆ GitHub: github.com/glytglobal/
 ☆ Type: Pinterest Search (Carousel Mode)
 ☆ Description: Specifically created and adapted
   for TheMystic-Bot-MD functionalities. Prohibited:
   - Selling
   - Unauthorized modification
   - Copyright changes
   Creative Commons (2025) License.

/////////////////////////////////
*/

import axios from 'axios';
import { proto, generateWAMessageFromContent, generateWAMessageContent } from '@whiskeysockets/baileys';

const handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) {
    return conn.sendMessage(m.chat, { 
      text: `*PINTEREST SEARCH*\n\n[❗] Please enter a search term\nExample: ${usedPrefix + command} Cat` 
    }, { quoted: m });
  }

  try {
    // Fetch Pinterest results from API
    const { data } = await axios.get(
      `${global.APIs.stellar}/search/pinterest?query=${encodeURIComponent(text)}&apikey=${global.APIKeys[global.APIs.stellar]}`
    );
    
    if (!data.data || data.data.length === 0) {
      throw new Error('No results found');
    }

    // Prepare carousel cards
    const cards = data.data.map((image, index) => ({
      body: proto.Message.InteractiveMessage.Body.fromObject({ 
        text: `\n□ Result number: ${index + 1}\n` 
      }),
      footer: proto.Message.InteractiveMessage.Footer.fromObject({ 
        text: global.pickbot 
      }),
      header: proto.Message.InteractiveMessage.Header.fromObject({ 
        title: '*PINTEREST SEARCH*',
        hasMediaAttachment: true,
        imageMessage: await generateWAMessageContent(
          { image: { url: image.mini } }, 
          { upload: conn.waUploadToServer }
        ).then(res => res.imageMessage)
      }),
      nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
        buttons: [{
          name: "cta_url",
          buttonParamsJson: JSON.stringify({
            display_text: "View in HD",
            url: image.hd,
            merchant_url: image.hd
          })
        }]
      })
    }));

    // Construct carousel message
    const botMessage = generateWAMessageFromContent(m.chat, { 
      viewOnceMessage: {
        message: {
          messageContextInfo: { 
            deviceListMetadata: {}, 
            deviceListMetadataVersion: 2 
          },
          interactiveMessage: proto.Message.InteractiveMessage.fromObject({
            body: proto.Message.InteractiveMessage.Body.create({ 
              text: "*PINTEREST SEARCH*" 
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({ 
              text: `□ *Search:* ${text}\n□ *Requested by:* ${global.db.data.users[m.sender].name || 'User'}` 
            }),
            header: proto.Message.InteractiveMessage.Header.create({ 
              hasMediaAttachment: false 
            }),
            carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({ 
              cards 
            })
          })
        }
      }
    }, { quoted: m });

    await conn.relayMessage(m.chat, botMessage.message, { messageId: botMessage.key.id });

  } catch (error) {
    console.error('Pinterest search error:', error);
    conn.sendMessage(m.chat, { 
      text: `*PINTEREST SEARCH*\n\n[❗] An error occurred while processing your request` 
    }, { quoted: m });
  }
};

handler.help = ['pinterest <query>'];
handler.tags = ['search'];
handler.command = ['pinterest', 'pin'];
handler.limit = true;

export default handler;