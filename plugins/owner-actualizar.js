import { execSync } from 'child_process';

const handler = async (m, { conn, text }) => {
  // Default English messages (fallback)
  const defaultMessages = {
    stashing: "🔄 Stashing local changes...",
    stashed: "📦 Changes stashed successfully",
    nothingToStash: "ℹ️ No local changes to stash",
    stashFailed: "❌ Could not stash changes",
    pulling: "⬇️ Pulling updates...",
    applying: "🔁 Reapplying changes...",
    applied: "✅ Changes reapplied successfully",
    conflict: "⚠️ Merge conflicts detected! Please resolve manually:",
    error: "❌ Error during update",
    upToDate: "✅ Already up to date",
    updated: "🎉 Bot updated successfully",
    fixSuggestions: "💡 Try running: git status"
  };

  // Try to load translations
  let translations = defaultMessages;
  try {
    const language = global.db.data.users[m.sender]?.language || global.defaultLanguage || 'en';
    const langFile = JSON.parse(fs.readFileSync(`./src/languages/${language}.json`));
    if (langFile?.plugins?.owner_update) {
      translations = { ...defaultMessages, ...langFile.plugins.owner_update };
    }
  } catch (e) {
    console.error('Translation error:', e);
  }

  try {
    // 1. Check for changes
    const status = execSync('git status --porcelain').toString();
    if (status.trim()) {
      await conn.reply(m.chat, translations.stashing, m);
      try {
        execSync('git stash push --include-untracked');
        await conn.reply(m.chat, translations.stashed, m);
      } catch (stashError) {
        await conn.reply(m.chat, translations.stashFailed, m);
      }
    } else {
      await conn.reply(m.chat, translations.nothingToStash, m);
    }

    // 2. Pull updates
    await conn.reply(m.chat, translations.pulling, m);
    const pullOutput = execSync(`git pull ${text || ''}`.trim()).toString();
    
    // 3. Handle result
    if (pullOutput.includes('Already up to date')) {
      await conn.reply(m.chat, translations.upToDate, m);
    } else {
      await conn.reply(m.chat, `${translations.updated}\n${pullOutput}`, m);
    }

  } catch (error) {
    console.error('Update error:', error);
    let errorMsg = translations.error;
    if (error.message) {
      errorMsg += `\n${error.message}`;
      if (error.message.includes('permission')) {
        errorMsg += `\n${translations.fixSuggestions}`;
      }
    }
    await conn.reply(m.chat, errorMsg, m);
  }
};

handler.help = ['update'];
handler.tags = ['owner'];
handler.command = /^(update|upgrade|gitpull)$/i;
handler.rowner = true;
export default handler;