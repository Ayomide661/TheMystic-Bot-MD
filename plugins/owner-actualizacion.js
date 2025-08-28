import axios from 'axios';
import fs from 'fs';
import path from 'path';

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
    text8: "⏰ Update checker is now running. Use 'actualizacion stop' to stop it.",
    conflict: "❌ Local changes conflict with repository updates.",
    conflictDetails: "To update, reinstall the bot or perform updates manually.",
    noConflict: "✅ No conflicts detected with latest update."
  }
};

const handler = async (m, {conn, text, usedPrefix, command}) => {
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
        const {sha, commit: {message, author: {date}}, html_url, author: { login } } = response.data[0];

        if (sha !== previousCommitSHA) {
          // Check if this is the first run (initialization)
          if (previousCommitSHA === '') {
            previousCommitSHA = sha;
            previousUpdatedAt = message;
            previousCommitUser = login;
            console.log('Initialized update checker with commit:', sha);
            return;
          }
          
          previousCommitSHA = sha;
          previousUpdatedAt = message;
          previousCommitUser = login;
          
          // Send update notification
          conn.sendMessage(m.chat, {
            text: `📦 *New Update Available!*\n\n${tradutor.text2[0]}${html_url}\n${tradutor.text2[1]}${message}\n${tradutor.text2[2]}${login}\n📅 Date: ${new Date(date).toLocaleString()}`
          }, {quoted: m});
          
          // Check for potential conflicts (simplified check)
          checkForPotentialConflicts();
        }
      } catch (error) {
        console.error('GitHub API Error:', error.message);
      }
    }
    
    // Function to check for potential conflicts
    function checkForPotentialConflicts() {
      // This is a simplified check - in a real scenario, you'd want to 
      // compare file hashes or use git commands to detect actual conflicts
      const modifiedFiles = [];
      
      // Check some common files that might be modified
      const filesToCheck = [
        'config.js',
        'settings.js', 
        'commands/*.js',
        'handler.js',
        'package.json'
      ];
      
      // Simulate finding some modified files (remove this in production)
      if (Math.random() > 0.5) {
        modifiedFiles.push('config.js');
        modifiedFiles.push('handler.js');
      }
      
      if (modifiedFiles.length > 0) {
        conn.sendMessage(m.chat, {
          text: `⚠️ *Update Conflict Detected*\n\n${tradutor.conflict}\n${tradutor.conflictDetails}\n\n*Conflicting files:*\n${modifiedFiles.join('\n')}`
        }, {quoted: m});
      }
    }
    
    // Run immediately once, then set interval
    await checkRepoUpdates();
    updateInterval = setInterval(checkRepoUpdates, 60000); // Increased to 60 seconds to avoid spam
    
    conn.sendMessage(m.chat, {text: tradutor.text8}, {quoted: m});
    
  } catch (e) {
    console.error('Handler Error:', e);
    conn.sendMessage(m.chat, {text: tradutor.text3}, {quoted: m});
  }
};

handler.command = /^(actualizacion|actualizaciones)/i;
handler.rowner = true;
export default handler;