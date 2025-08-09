/**
 * NPM Package Search Command
 * @author GabrielVz <@glytglobal>
 * @description Search for NPM packages from npmjs.com registry
 */

import fetch from 'node-fetch';

const handler = async (m, { text, conn }) => {
  // Validate input
  if (!text) {
    return m.reply(`🔍 *NPM Package Search*\n\nPlease enter a package name to search\nExample: *npmjs express*`);
  }

  try {
    // Fetch from NPM registry
    const res = await fetch(`https://registry.npmjs.com/-/v1/search?text=${encodeURIComponent(text)}`);
    const { objects } = await res.json();
    
    // Handle no results
    if (!objects?.length) {
      return m.reply(`🔍 *NPM Package Search*\n\nNo packages found for "${text}" on npmjs.com`);
    }

    // Format results (limit to 5 to avoid message flooding)
    const topResults = objects.slice(0, 5);
    const npmText = topResults.map(({ package: pkg }) => {
      return `📦 *Package:* ${pkg.name}\n` +
             `🔄 *Version:* ${pkg.version || 'Not specified'}\n` +
             `📝 *Description:* ${pkg.description || 'No description'}\n` +
             `🔗 *Link:* ${pkg.links?.npm || 'Not available'}\n` +
             `─────────────────`;
    }).join('\n\n');

    // Send results with default NPM image
    await conn.sendMessage(
      m.chat,
      { 
        image: { url: 'https://static.npmjs.com/338e4905a2684ca96e08c7780fc68412.png' },
        caption: `🔍 *NPM Search Results for:* ${text}\n\n${npmText}\n\n*Showing ${topResults.length} of ${objects.length} results*`,
        footer: 'Powered by npmjs.com registry'
      },
      { quoted: m }
    );

  } catch (error) {
    console.error('NPM search error:', error);
    m.reply(`🔍 *NPM Package Search*\n\nAn error occurred while searching. Please try again later.`);
  }
};

// Command metadata
handler.help = ['npmjs <package-name>'];
handler.tags = ['search', 'developer'];
handler.command = /^npm(js)?$/i;
handler.limit = true; // Prevent abuse

export default handler;