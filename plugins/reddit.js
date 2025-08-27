import fetch from 'node-fetch';
import fs from 'fs';

// Reddit download function with better error handling
async function reddit(url) {
    try {
        console.log('Processing Reddit URL:', url);
        
        // Validate Reddit URL
        if (!url.match(/https?:\/\/(www\.)?reddit\.com\/r\/\w+\/comments\/\w+/)) {
            throw new Error('Invalid Reddit URL format. Please use a format like: https://www.reddit.com/r/subreddit/comments/post_id/');
        }

        // Add .json to the URL to get the JSON data
        const jsonUrl = url.endsWith('/') ? `${url}.json` : `${url}/.json`;
        console.log('Fetching JSON from:', jsonUrl);
        
        const response = await fetch(jsonUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            timeout: 10000
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`Reddit API error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Reddit API response received');
        
        // Extract post data from Reddit JSON structure
        if (!data || !data[0] || !data[0].data || !data[0].data.children[0]) {
            throw new Error('Invalid Reddit API response structure');
        }
        
        const postData = data[0].data.children[0].data;
        console.log('Post data extracted, type:', postData.post_hint || 'text');
        
        // Handle different types of Reddit posts
        if (postData.is_video) {
            console.log('Processing video post');
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
        } 
        
        // Check for gallery posts
        if (postData.is_gallery && postData.media_metadata) {
            console.log('Processing gallery post');
            // Handle gallery posts - get first image
            const firstImageId = Object.keys(postData.media_metadata)[0];
            const imageData = postData.media_metadata[firstImageId];
            if (imageData && imageData.s && imageData.s.u) {
                const imageUrl = imageData.s.u.replace(/&amp;/g, '&');
                return {
                    type: 'image',
                    url: imageUrl,
                    title: postData.title,
                    author: postData.author,
                    subreddit: postData.subreddit,
                    isGallery: true
                };
            }
        }
        
        // Check for image posts
        if (postData.url && postData.post_hint === 'image') {
            console.log('Processing image post');
            return {
                type: 'image',
                url: postData.url,
                title: postData.title,
                author: postData.author,
                subreddit: postData.subreddit
            };
        }
        
        // Check for link posts with images
        if (postData.url && postData.url.match(/\.(jpg|jpeg|png|gif|webp|mp4)$/i)) {
            console.log('Processing link with media');
            return {
                type: 'image',
                url: postData.url.replace('.gifv', '.mp4'),
                title: postData.title,
                author: postData.author,
                subreddit: postData.subreddit
            };
        }
        
        // Text post
        console.log('Processing text post');
        return {
            type: 'text',
            title: postData.title,
            text: postData.selftext,
            author: postData.author,
            subreddit: postData.subreddit,
            url: `https://reddit.com${postData.permalink}`
        };
        
    } catch (error) {
        console.error('Reddit download error details:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
        }
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

// Alternative method using a proxy API
async function redditProxy(url) {
    try {
        console.log('Trying proxy method for:', url);
        const proxyUrl = `https://api.rival.rocks/reddit?url=${encodeURIComponent(url)}`;
        const response = await fetch(proxyUrl, {
            timeout: 15000
        });
        
        if (!response.ok) {
            throw new Error(`Proxy API error: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Proxy method failed:', error.message);
        throw error;
    }
}

// Handler function
const handler = async (m, { conn, args }) => {
    try {
        const tradutor = {
            usage: 'Please provide a Reddit URL or reply to a message containing one. Example: https://www.reddit.com/r/funny/comments/abc123/funny_post/',
            invalid: 'Invalid Reddit URL. Please use a proper Reddit post URL.',
            error: 'Failed to download from Reddit. The post might not contain downloadable media or Reddit might be blocking the request.',
            noMedia: 'This Reddit post doesn\'t contain downloadable media (images/videos).'
        };

        let match = args.join(' ') || '';
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
        
        let result;
        try {
            // Try direct method first
            result = await reddit(url);
        } catch (error) {
            console.log('Direct method failed, trying proxy...');
            // If direct method fails, try proxy
            try {
                result = await redditProxy(url);
            } catch (proxyError) {
                console.error('Both methods failed:', proxyError.message);
                return m.reply(tradutor.error + '\n\nError: ' + proxyError.message);
            }
        }
        
        if (!result) {
            return m.reply(tradutor.noMedia);
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
                if (result.url.includes('.mp4') || result.url.includes('.gif')) {
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
                const text = result.text && result.text.length > 1500 
                    ? result.text.substring(0, 1500) + '...' 
                    : result.text || 'No text content';
                    
                await m.reply(
                    `*${result.title}*\n\n${text}\n\nPosted by u/${result.author} in r/${result.subreddit}\n\n${result.url}`
                );
                break;
                
            default:
                return m.reply(tradutor.noMedia);
        }
        
    } catch (error) {
        console.error('Reddit command error:', error);
        return m.reply('An unexpected error occurred. Please try again later.');
    }
};

handler.help = ['reddit <url>'];
handler.tags = ['download'];
handler.command = /^(reddit|rdt)$/i;

export default handler;