const handler = async (m, { conn, text }) => {
  // Clear the chat function
  async function clearChat(chatId) {
    try {
      // This will vary based on your bot library
      // Here's a generic approach that should work with most frameworks
      await conn.sendMessage(chatId, { 
        text: 'Clearing chat...',
        delete: true 
      });
      
      // Alternative approach if the above doesn't work
      // This simulates clearing by deleting messages in batches
      let cleared = false;
      
      // Try different methods based on what your library supports
      if (typeof conn.clearMessages === 'function') {
        await conn.clearMessages(chatId);
        cleared = true;
      } 
      else if (typeof conn.modifyChat === 'function') {
        await conn.modifyChat(chatId, 'clear');
        cleared = true;
      }
      else if (typeof conn.deleteAllMessages === 'function') {
        await conn.deleteAllMessages(chatId);
        cleared = true;
      }
      
      if (cleared) {
        await conn.sendMessage(chatId, { 
          text: '✅ Chat cleared successfully!',
          delete: { 
            remote: { 
              id: m.id, 
              fromMe: true 
            }, 
            duration: 3000 
          }
        });
      } else {
        // Fallback method if no direct clear function exists
        await conn.sendMessage(chatId, { 
          text: '⚠️ Clear function not directly supported. Please try manual deletion.',
          delete: { 
            remote: { 
              id: m.id, 
              fromMe: true 
            }, 
            duration: 5000 
          }
        });
      }
    } catch (error) {
      console.error('Clear chat error:', error);
      await conn.sendMessage(chatId, { 
        text: '❌ Failed to clear chat. Please check bot permissions.',
        delete: { 
          remote: { 
            id: m.id, 
            fromMe: true 
          }, 
          duration: 5000 
        }
      });
    }
  }

  // Execute the clear function
  await clearChat(m.chat);
};

handler.command = /^(clear|clearchat)$/i;
handler.help = ['clear'];
handler.tags = ['chat'];
handler.admin = true;
handler.group = true;
handler.botAdmin = true; // Bot needs to be admin to clear chats

export default handler;