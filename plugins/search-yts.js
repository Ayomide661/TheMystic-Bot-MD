import { prepareWAMessageMedia, generateWAMessageFromContent, getDevice } from "baileys"
import yts from 'yt-search';
import fs from 'fs';

const handler = async (m, { conn, text, usedPrefix: prefix }) => {
    try {
        // Load YouTube-specific language file
        const langFile = './src/languages/yt-en.json';
        const traductor = JSON.parse(fs.readFileSync(langFile));
        
        // Fallback translations if file is missing properties
        const translations = {
            text1: traductor.text1 || "Please enter a search term",
            text2: traductor.text2 || ["URL", "Duration", "Uploaded", "Views"],
            searchResults: traductor.searchResults || "Search results",
            randomVideo: traductor.randomVideo || "Random video",
            title: traductor.title || "Title",
            author: traductor.author || "Author",
            views: traductor.views || "Views",
            thumbnail: traductor.thumbnail || "Thumbnail",
            optionsTitle: traductor.optionsTitle || "AVAILABLE OPTIONS",
            downloadMP3: traductor.downloadMP3 || "Download MP3",
            downloadMP4: traductor.downloadMP4 || "Download MP4"
        };

        const device = await getDevice(m.key.id);

        if (!text) throw `⚠️ *${translations.text1}*`;

        const results = await yts(text);
        if (!results?.videos?.length) return m.reply('> *[❗] Error: No videos found.*');
        
        const videos = results.videos.slice(0, 20);
        const randomIndex = Math.floor(Math.random() * videos.length);
        const randomVideo = videos[randomIndex];

        // Mobile/Web version
        if (device !== 'desktop' && device !== 'web') {
            const messa = await prepareWAMessageMedia(
                { image: {url: randomVideo.thumbnail}}, 
                { upload: conn.waUploadToServer }
            );

            const interactiveMessage = {
                body: { 
                    text: `*—◉ ${translations.searchResults}:* ${results.videos.length}\n*—◉ ${translations.randomVideo}:*\n*-› ${translations.title}:* ${randomVideo.title}\n*-› ${translations.author}:* ${randomVideo.author.name}\n*-› ${translations.views}:* ${randomVideo.views}\n*-› ${translations.text2[0]}:* ${randomVideo.url}\n*-› ${translations.thumbnail}:* ${randomVideo.thumbnail}`.trim() 
                },
                footer: { text: `${global.wm}`.trim() },  
                header: {
                    title: `*< YouTube Search />*\n`,
                    hasMediaAttachment: true,
                    imageMessage: messa.imageMessage,
                },
                nativeFlowMessage: {
                    buttons: [
                        {
                            name: 'single_select',
                            buttonParamsJson: JSON.stringify({
                                title: translations.optionsTitle,
                                sections: videos.map((video) => ({
                                    title: video.title,
                                    rows: [
                                        {
                                            header: video.title,
                                            title: video.author.name,
                                            description: translations.downloadMP3,
                                            id: `${prefix}ytmp3 ${video.url}`
                                        },
                                        {
                                            header: video.title,
                                            title: video.author.name,
                                            description: translations.downloadMP4,
                                            id: `${prefix}ytmp4 ${video.url}`
                                        }
                                    ]
                                }))
                            })
                        }
                    ],
                    messageParamsJson: ''
                }
            };        

            const msg = generateWAMessageFromContent(m.chat, {
                viewOnceMessage: {
                    message: {
                        interactiveMessage,
                    },
                },
            }, { userJid: conn.user.jid, quoted: m });
            
            await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id});
        } 
        // Desktop version
        else {
            const tes = results.all;
            const teks = results.all.map((v) => {
                if (v.type === 'video') {
                    return `
° *_${v.title}_*
↳ 🫐 *_${translations.text2[0]}_* ${v.url}
↳ 🕒 *_${translations.text2[1]}_* ${v.timestamp}
↳ 📥 *_${translations.text2[2]}_* ${v.ago}
↳ 👁 *_${translations.text2[3]}_* ${v.views}`;
                }
                return null;
            }).filter(Boolean).join('\n\n◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦\n\n');
            
            await conn.sendFile(m.chat, tes[0].thumbnail, 'error.jpg', teks.trim(), m);
        }
    } catch (error) {
        console.error('Error in ytsearch handler:', error);
        m.reply('> *[❗] An error occurred while processing your request.*');
    }
};

handler.help = ['ytsearch <text>'];
handler.tags = ['search'];
handler.command = /^(ytsearch|yts|searchyt|videosearch|audiosearch)$/i;
export default handler;