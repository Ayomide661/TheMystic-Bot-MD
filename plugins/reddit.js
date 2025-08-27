import fetch from 'node-fetch';
import fs from 'fs';

// Reddit download function
async function reddit(url) {
    try {
        // Validate Reddit URL
        if (!url.match(/https?:\/\/(www\.)?reddit\.com\/r\/\w+\/comments\/\w+/)) {
            throw new Error('Invalid Reddit URL format');
        }

        // Add .json to the URL to get the JSON data
        const jsonUrl = url.endsWith('/') ? `${url}.json` : `${url}/.json`;
        
        const response = await fetch(jsonUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Extract post data from Reddit JSON structure
        const postData = data[0]?.data?.children[0]?.data;
        if (!postData) {
            throw new Error('No post data found');
        }
        
        // Handle different types of Reddit posts
        if (postData.is_video) {
            // Video post
            const videoUrl = postData.media?.reddit_video?.fallback_url;
            if (videoUrl) {
                return {
                    type: 'video',
                    url: videoUrl,
                    title: postData.title,
                    author: postData.author,
                    subreddit: postData.subreddit
                };
            }
        } else if (postData.url) {
            // Image/GIF post
            const url = postData.url;
            if (url.match(/\.(jpg|jpeg|png|gif|gifv|webp|mp4)$/i)) {
                return {
                    type: 'image',
                    url: url.replace('.gifv', '.mp4'), // Convert gifv to mp4
                    title: postData.title,
                    author: postData.author,
                    subreddit: postData.subreddit
                };
            }
        }
        
        // Text post or unsupported type
        return {
            type: 'text',
            title: postData.title,
            text: postData.selftext,
            author: postData.author,
            subreddit: postData.subreddit,
            url: `https://reddit.com${postData.permalink}`
        };
        
    } catch (error) {
        console.error('Reddit download error:', error);
        throw error;
    }
}

// URL validation function
function isUrl(text) {
    if (!text) return false;
    const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
    const match = text.match(urlRegex);
    return match ? match[0] : false;
}

// Handler function
const handler = async (m, { conn, args }) => {
    try {
        // Default English translations as fallback
        let tradutor = {
            desc: 'Download content from Reddit posts',
            usage: 'Please provide a Reddit URL or reply to a message containing one',
            error: 'Failed to download from Reddit. Please check the URL and try again.',
            invalid: 'Invalid Reddit URL',
            noMedia: 'No downloadable media found in this post'
        };
        
        // Try to load language file if exists
        try {
            const datas = global;
            const idioma = datas.db?.data?.users[m.sender]?.language || 'en';
            
            if (fs.existsSync(`./src/languages/${idioma}.json`)) {
                const _translate = JSON.parse(fs.readFileSync(`./src/languages/${idioma}.json`));
                // Safely access the reddit plugin translations
                if (_translate.plugins && _translate.plugins.reddit) {
                    tradutor = { ...tradutor, ..._translate.plugins.reddit };
                }
            }
        } catch (e) {
            console.error('Language file error:', e);
            // Continue with default translations
        }

        let match = args[0] || '';
        if (!match && m.quoted) {
            match = m.quoted.text || '';
        }
        
        const url = isUrl(match);
        if (!url) {
            return m.reply(tradutor.usage);
        }
        
        // Verify it's a Reddit URL
        if (!url.includes('reddit.com')) {
            return m.reply(tradutor.invalid);
        }
        
        const result = await reddit(url);
        
        if (!result) {
            return m.reply(tradutor.error);
        }
        
        // Handle different response types
        switch (result.type) {
            case 'video':
                await conn.sendMessage(m.chat, {
                    video: { url: result.url },
                    caption: `*${result.title}*\n\nPosted by u/${result.author} in r/${result.subreddit}`
                }, { quoted: m });
                break;
                
            case 'image':
                if (result.url.endsWith('.mp4')) {
                    await conn.sendMessage(m.chat, {
                        video: { url: result.url },
                        caption: `*${result.title}*\n\nPosted by u/${result.author} in r/${result.subreddit}`
                    }, { quoted: m });
                } else {
                    await conn.sendMessage(m.chat, {
                        image: { url: result.url },
                        caption: `*${result.title}*\n\nPosted by u/${result.author} in r/${result.subreddit}`
                    }, { quoted: m });
                }
                break;
                
            case 'text':
                // Truncate long text
                const text = result.text.length > 1500 
                    ? result.text.substring(0, 1500) + '...' 
                    : result.text;
                    
                await conn.sendMessage(m.chat, {
                    text: `*${result.title}*\n\n${text}\n\nPosted by u/${result.author} in r/${result.subreddit}\n\n${result.url}`
                }, { quoted: m });
                break;
                
            default:
                return m.reply(tradutor.noMedia);
        }
        
    } catch (error) {
        console.error('Reddit command error:', error);
        // Use safe error message
        const errorMsg = 'Failed to download from Reddit. Please check the URL and try again.';
        return m.reply(errorMsg);
    }
};

handler.help = ['reddit <url>'];
handler.tags = ['download'];
handler.command = /^(reddit|rdt)$/i;

export {
    reddit,
    isUrl
};

export default handler;