import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pluginsDir = path.join(__dirname, '../plugins');
const gitignorePath = path.join(__dirname, '../.gitignore');

// It's not necessary to verify the plugins folder exists since it exists in mystic, but it might be useful for other bots
const ensurePluginsDirExists = () => {
  if (!fs.existsSync(pluginsDir)) {
    fs.mkdirSync(pluginsDir, { recursive: true });
  }
};

const isValidUrl = (text) => {
  try {
    new URL(text);
    return true;
  } catch {
    return false;
  }
};

const readGitignore = async () => {
  if (fs.existsSync(gitignorePath)) {
    return await fs.promises.readFile(gitignorePath, 'utf-8');
  }
  return '';
};

const writeGitignore = async (content) => {
  await fs.promises.writeFile(gitignorePath, content, 'utf-8');
};

const addToGitignore = async (pluginPath) => {
  try {
    const relativePluginPath = path.relative(path.join(__dirname, '../'), pluginPath);
    let gitignoreContent = await readGitignore();

    if (!gitignoreContent.includes(relativePluginPath)) {
      gitignoreContent += `\n${relativePluginPath}\n`;
      await writeGitignore(gitignoreContent);
      console.log(`✅ ${relativePluginPath} added to .gitignore`);
    }
  } catch (error) {
    throw new Error(`Error updating .gitignore: ${error.message}`);
  }
};

const removeFromGitignore = async (pluginPath) => {
  try {
    const relativePluginPath = path.relative(path.join(__dirname, '../'), pluginPath);
    let gitignoreContent = await readGitignore();

    if (gitignoreContent.includes(relativePluginPath)) {
      gitignoreContent = gitignoreContent
        .split('\n')
        .filter(line => line.trim() !== relativePluginPath)
        .join('\n');
      await writeGitignore(gitignoreContent);
      console.log(`✅ ${relativePluginPath} removed from .gitignore`);
    }
  } catch (error) {
    throw new Error(`Error updating .gitignore: ${error.message}`);
  }
};

const downloadPlugin = async (url, pluginName) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`❌ Error downloading plugin: ${response.statusText}`);

    const pluginPath = path.join(pluginsDir, pluginName);
    const fileStream = fs.createWriteStream(pluginPath);

    await new Promise((resolve, reject) => {
      response.body.pipe(fileStream);
      response.body.on('error', reject);
      fileStream.on('finish', resolve);
    });

    console.log(`✅ Plugin downloaded: ${pluginName}`);
    return pluginPath;
  } catch (error) {
    throw new Error(`Error downloading plugin: ${error.message}`);
  }
};

const deletePlugin = async (pluginName) => {
  const pluginPath = path.join(pluginsDir, pluginName);
  try {
    if (fs.existsSync(pluginPath)) {
      await removeFromGitignore(pluginPath);
      fs.unlinkSync(pluginPath);
      console.log(`✅ Plugin ${pluginName} deleted.`);
      return `✅ 🗑️ ${pluginName} `;
    } else {
      return `❌ ${pluginName} doesn't exist.`;
    }
  } catch (error) {
    throw new Error(`Error deleting plugin: ${error.message}`);
  }
};

const handler = async (m, { text }) => {
  if (!text) return m.reply('❌ Usage: .plg url OR .plg name');

  try {
    const input = text.trim();
    ensurePluginsDirExists(); // unnecessary

    if (isValidUrl(input)) {
      const pluginName = path.basename(input); 
      const pluginPath = await downloadPlugin(input, pluginName); 
      await addToGitignore(pluginPath); 
      m.reply(`✅ ${pluginName} installed`);
    } else {
      const result = await deletePlugin(input); 
      m.reply(result);
    }
  } catch (error) {
    console.error("Error processing command:", error);
    const errorMessage = error.message.includes('Error deleting plugin') // complex and unnecessary. Brr
      ? error.message.split('❌ ')[1]
      : `❌ ${error.message}`;
    m.reply(errorMessage);
  }
};

handler.command = /^plg$/i;
handler.help = ['Plugin Installer plg <url or name>'];
handler.tags = ['tools'];
handler.owner = true; // Only the owner can use this command

export default handler;