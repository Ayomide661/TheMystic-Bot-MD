import fetch from 'node-fetch';
import fs from 'fs';

// Working Reddit download function with reliable APIs
async function reddit(url) {
    try {
        console.log('Processing Reddit URL:', url);
        
        // Validate Reddit URL
        if (!url.match(/https?:\/\/(www\.)?reddit\.com\/r\/\w+\/comments\/\w+/)) {
            throw new Error('Invalid Reddit URL format');
        }

        // Extract post ID from URL
        const postIdMatch = url.match(/comments\/(\w+)/);
        if (!postIdMatch) {
            throw new Error('Could not extract post ID from URL');
        }
        const postId = postIdMatch[1];
        console.log('Extracted post ID:', postId);
        
        // Method 1: Use reliable Reddit API
        try {
            const apiUrl = `https://www.reddit.com/comments/${postId}.json`;
            console.log('Fetching from Reddit API:', apiUrl);
            
            const response = await fetch(apiUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                timeout: 10000
            });
            
            if (!response.ok) {
                throw new Error(`Reddit API error: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Reddit API response received');
            
            // Extract post data
            const postData = data[0]?.data?.children[0]?.data;
            if (!postData) {
                throw new Error('No post data found in API response');
            }
            
            console.log('Post title:', postData.title);
            console.log('Post type:', postData.post_hint || 'text');
            
            // Handle video posts
            if (postData.is_video) {
                console.log('Processing video post');
                const videoUrl = postData.media?.reddit_video?.fallback_url;
                const audioUrl = postData.media?.reddit_video?.hls_url;
                
                if (videoUrl) {
                    return {
                        type: 'video',
                        url: videoUrl,
                        audioUrl: audioUrl,
                        title: postData.title,
                        author: postData.author,
                        subreddit: postData.subreddit
                    };
                }
            }
            
            // Handle image posts
            if (postData.url && (
                postData.post_hint === 'image' || 
                postData.url.match(/\.(jpg|jpeg|png|gif|webp)$/i)
            )) {
                console.log('Processing image post');
                return {
                    type: 'image',
                    url: postData.url,
                    title: postData.title,
                    author: postData.author,
                    subreddit: postData.subreddit
                };
            }
            
            // Handle GIF posts (convert to MP4)
            if (postData.url && postData.url.includes('.gif')) {
                console.log('Processing GIF post');
                return {
                    type: 'video',
                    url: postData.url.replace('.gif', '.mp4').replace('.gifv', '.mp4'),
                    title: postData.title,
                    author: postData.author,
                    subreddit: postData.subreddit
                };
            }
            
            // Text post fallback
            console.log('Processing as text post');
            return {
                type: 'text',
                title: postData.title,
                text: postData.selftext,
                author: postData.author,
                subreddit: postData.subreddit,
                url: `https://reddit.com${postData.permalink}`
            };
            
        } catch (apiError) {
            console.log('Reddit API method failed, trying alternative...');
            throw apiError;
        }
        
    } catch (error) {
        console.error('Reddit download error:', error.message);
        throw error;
    }
}

// Alternative method using a working proxy service
async function redditProxy(url) {
    try {
        console.log('Trying pushshift API for:', url);
        
        // Extract post ID
        const postIdMatch = url.match(/comments\/(\w+)/);
        if (!postIdMatch) throw new Error('Invalid Reddit URL');
        const postId = postIdMatch[1];
        
        // Use pushshift API as backup
        const pushshiftUrl = `https://api.pushshift.io/reddit/submission/search?ids=${postId}`;
        const response = await fetch(pushshiftUrl, { timeout: 10000 });
        
        if (!response.ok) throw new Error(`Pushshift API error: ${response.status}`);
        
        const data = await response.json();
        if (!data.data || data.data.length === 0) throw new Error('No data from Pushshift');
        
        const post = data.data[0];
        return {
            type: 'text',
            title: post.title,
            text: post.selftext || 'No text content available',
            author: post.author,
            subreddit: post.subreddit,
            url: `https://reddit.com${post.permalink}`
        };
        
    } catch (error) {
        console.error('Proxy method failed:', error.message);
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
        const tradutor = {
            usage: 'Please provide a Reddit URL. Example: !reddit https://www.reddit.com/r/funny/comments/abc123/funny_post/',
            invalid: 'Invalid Reddit URL. Please use a proper Reddit post URL.',
            error: 'Failed to download from Reddit. The post might not contain media or the API might be temporarily unavailable.',
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
            console.log('Direct method failed, trying text-only fallback...');
            // Fallback to text-only version
            try {
                result = await redditProxy(url);
            } catch (proxyError) {
                console.error('All methods failed:', proxyError.message);
                return m.reply('Sorry, I couldn\'t download this Reddit post. Please make sure:\n1. The URL is correct\n2. The post contains images/videos\n3. Try again later');
            }
        }
        
        if (!result) {
            return m.reply(tradutor.noMedia);
        }
        
        console.log('Sending result type:', result.type);
        
        // Handle different response types
        switch (result.type) {
            case 'video':
                try {
                    await conn.sendMessage(m.chat, {
                        video: { url: result.url },
                        caption: `*${result.title}*\n\nPosted by u/${result.author} in r/${result.subreddit}`
                    }, { quoted: m });
                } catch (videoError) {
                    console.error('Video send failed:', videoError);
                    await m.reply(
                        `*${result.title}*\n\nVideo URL: ${result.url}\n\nPosted by u/${result.author} in r/${result.subreddit}`
                    );
                }
                break;
                
            case 'image':
                try {
                    await conn.sendMessage(m.chat, {
                        image: { url: result.url },
                        caption: `*${result.title}*\n\nPosted by u/${result.author} in r/${result.subreddit}`
                    }, { quoted: m });
                } catch (imageError) {
                    console.error('Image send failed:', imageError);
                    await m.reply(
                        `*${result.title}*\n\nImage URL: ${result.url}\n\nPosted by u/${result.author} in r/${result.subreddit}`
                    );
                }
                break;
                
            case 'text':
                const text = result.text && result.text.length > 1500 
                    ? result.text.substring(0, 1500) + '...' 
                    : result.text || 'No text content available';
                    
                await m.reply(
                    `*${result.title}*\n\n${text}\n\nPosted by u/${result.author} in r/${result.subreddit}\n\n${result.url}`
                );
                break;
                
            default:
                return m.reply(tradutor.noMedia);
        }
        
    } catch (error) {
        console.error('Reddit command error:', error);
        return m.reply('An error occurred while processing the Reddit post. Please try again with a different post.');
    }
};

handler.help = ['reddit <url>'];
handler.tags = ['download'];
handler.command = /^(reddit|rdt)$/i;

export default handler;