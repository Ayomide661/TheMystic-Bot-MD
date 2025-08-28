const handler = async (m, { conn }) => {
  // Alternative: Delete recent messages one by one
  try {
    await conn.sendMessage(m.chat, { 
      text: 'Starting chat clearance... This may take a while.' 
    });
    
    // This would require storing message IDs or using a different approach
    // since we can't fetch message history through the API easily
    
    await conn.sendMessage(m.chat, { 
      text: '❌ Automatic clearing not supported. Please clear manually or check documentation for supported methods.',
      delete: { 
        remote: { 
          id: m.id, 
          fromMe: true 
        }, 
        duration: 5000 
      }
    });
  } catch (error) {
    console.error('Clear error:', error);
  }
};

handler.command = /^(clear|clearchat)$/i;
handler.admin = true;
handler.group = true;
handler.botAdmin = true;

export default handler;