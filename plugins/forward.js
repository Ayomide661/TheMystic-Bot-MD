import { forwardOrBroadCast } from '../lib/index.js';

const handler = async (m, { conn, args, usedPrefix, command }) => {
  // Check if message is being replied to
  if (!m.quoted) {
    return conn.reply(m.chat, '❌ *Reply to a message* to forward it', m);
  }

  // Get the JID from arguments
  const jid = args[0];
  if (!jid) {
    return conn.reply(m.chat, 
      `❌ *Invalid JID!*\n\n` +
      `> *Usage:*\n` +
      `- ${usedPrefix}forward <jid>\n` +
      `- ${usedPrefix}forward 1234567890@s.whatsapp.net`,
      m
    );
  }

  try {
    // Validate JID format
    if (!jid.includes('@') || (!jid.endsWith('.net') && !jid.endsWith('.com'))) {
      return conn.reply(m.chat, 
        `❌ *Invalid JID format!*\n` +
        `Please use a valid WhatsApp JID:\n` +
        `Example: 1234567890@s.whatsapp.net`,
        m
      );
    }

    // Use forwardOrBroadCast function instead of conn.forwardMessage
    await forwardOrBroadCast(jid, m);

    // Success confirmation
    await conn.reply(m.chat, 
      `✅ *Message forwarded successfully!*\n` +
      `To: ${jid}`,
      m
    );

  } catch (error) {
    console.error('Forward Error:', error);
    
    // Handle specific errors
    if (error.message.includes('not found')) {
      await conn.reply(m.chat, 
        `❌ *JID not found!*\n` +
        `The recipient may not be using WhatsApp or the JID is incorrect.`,
        m
      );
    } else if (error.message.includes('group')) {
      await conn.reply(m.chat, 
        `❌ *Cannot forward to group!*\n` +
        `This command only works for individual users.`,
        m
      );
    } else {
      await conn.reply(m.chat, 
        `❌ *Forward failed!*\n` +
        `Error: ${error.message}`,
        m
      );
    }
  }
};

handler.help = ['forward <jid>'];
handler.tags = ['tools'];
handler.command = ['forward', 'fwd'];
handler.admin = false;
handler.botAdmin = false;

export default handler;