const handler = async (m, {conn}) => {
  // Check if audio features are enabled
  if (!db.data.chats[m.chat].audios) return;
  if (!db.data.settings[conn.user.jid].audios_bot && !m.isGroup) return;

  const audioFile = './src/assets/audio/01J672JMF3RCG7BPJW4X2P94N2.mp3';
  
  // Show recording status and send audio
  conn.sendPresenceUpdate('recording', m.chat);
  conn.sendMessage(m.chat, {
    audio: {url: audioFile},
    ptt: true,
    mimetype: 'audio/mpeg',
    fileName: 'audio_message.mp3'
  }, {quoted: m});
};

// Trigger on 'a', 'A', or 'ª' (in both uppercase and lowercase)
handler.customPrefix = /ª|a|A/i;
handler.command = /^(a|ª|A?)$/i;

export default handler;