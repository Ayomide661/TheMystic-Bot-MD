import axios from 'axios';

let previousCommitSHA = '';
let previousUpdatedAt = '';
let previousCommitUser = ''; 
let updateInterval = null;
const owner = 'Ayomide661';
const repo = 'TheMystic-Bot-MD';

// Built-in translations
const translations = {
  en: {
    text1: "🔍 Checking for repository updates...",
    text2: ["📝 Update URL: ", "💭 Commit message: ", "👤 Author: "],
    text3: "❌ Error checking for updates",
    text4: "✅ Update checking stopped",
    text5: "❌ No active update checking to stop",
    text6: "⚠️ Update checking is already running. Use 'actualizacion stop' to stop it.",
    text7: "✅ Update checking started. I will notify you of new commits.",
    text8: "⏰ Update checker is now running. Use 'actualizacion stop' to stop it."
  },
  es: {
    text1: "🔍 Buscando actualizaciones del repositorio...",
    text2: ["📝 URL de actualización: ", "💭 Mensaje de commit: ", "👤 Autor: "],
    text3: "❌ Error al buscar actualizaciones",
    text4: "✅ Comprobación de actualizaciones detenida",
    text5: "❌ No hay comprobación de actualizaciones activa para detener",
    text6: "⚠️ La comprobación de actualizaciones ya está en ejecución. Usa 'actualizacion stop' para detenerla.",
    text7: "✅ Comprobación de actualizaciones iniciada. Te notificaré de nuevos commits.",
    text8: "⏰ El comprobador de actualizaciones está ahora en ejecución. Usa 'actualizacion stop' para detenerlo."
  }
};

const handler = async (m, {conn, text, usedPrefix, command}) => {
  // Default to English if no language is set
  const tradutor = translations.en;
  
  // Check if user wants to stop the updates
  if (text && text.toLowerCase() === 'stop') {
    if (updateInterval) {
      clearInterval(updateInterval);
      updateInterval = null;
      conn.sendMessage(m.chat, {text: tradutor.text4}, {quoted: m});
    } else {
      conn.sendMessage(m.chat, {text: tradutor.text5}, {quoted: m});
    }
    return;
  }

  // Check if updates are already running
  if (updateInterval) {
    conn.sendMessage(m.chat, {text: tradutor.text6}, {quoted: m});
    return;
  }

  conn.sendMessage(m.chat, {text: tradutor.text1}, {quoted: m});  
  
  try {
    async function checkRepoUpdates() {
      try {
        const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`);
        const {sha, commit: {message}, html_url, author: { login } } = response.data[0];

        if (sha !== previousCommitSHA || message !== previousUpdatedAt) {
          previousCommitSHA = sha;
          previousUpdatedAt = message;
          previousCommitUser = login;
          conn.sendMessage(m.chat, {
            text: `${tradutor.text2[0]}${html_url}\n${tradutor.text2[1]}${message}\n${tradutor.text2[2]}${login}`
          }, {quoted: m});
        }
      } catch (error) {
        console.error('GitHub API Error:', error.message);
        // Don't send error message on every interval to avoid spam
      }
    }
    
    // Run immediately once, then set interval
    await checkRepoUpdates();
    updateInterval = setInterval(checkRepoUpdates, 6000);
    
    conn.sendMessage(m.chat, {text: tradutor.text8}, {quoted: m});
    
  } catch (e) {
    console.error('Handler Error:', e);
    conn.sendMessage(m.chat, {text: tradutor.text3}, {quoted: m});
  }
};

handler.command = /^(actualizacion|actualizaciones)/i;
handler.rowner = true;
export default handler;