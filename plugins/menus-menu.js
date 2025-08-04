import { promises as fs } from 'fs';
import { join } from 'path';

const handler = async (m, { conn, usedPrefix, __dirname, isPrems }) => {
    const language = global.db.data.users[m.sender]?.language || global.defaultLanguage || 'en';
    const _translate = JSON.parse(await fs.readFile(`./src/languages/${language}/${m.plugin}.json`));
    const translator = _translate.plugins.menu;

    try {
        const username = '@' + m.sender.split('@s.whatsapp.net')[0];
        if (usedPrefix == 'a' || usedPrefix == 'A') return;

        const more = String.fromCharCode(8206);
        const readMore = more.repeat(4001);

        const d = new Date(new Date().getTime() + 3600000);

        const localeMap = {
            'es': 'es-ES',
            'en': 'en-US',
            'ar': 'ar-SA'
        };

        const locale = localeMap[language.toLowerCase()] || 'en-US';

        let week, date;
        try {
            week = d.toLocaleDateString(locale, { weekday: 'long' });
            date = d.toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' });
        } catch (error) {
            week = d.toLocaleDateString('en-US', { weekday: 'long' });
            date = d.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
        }

        const _uptime = process.uptime() * 1000;
        const uptime = clockString(_uptime);
        const rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length;
        const rtotal = Object.keys(global.db.data.users).length || '0';

        const tags = translator.tags || {};

        const extrasCommands = {
            'info': [
                `${usedPrefix}audiosmenu`,
                `${usedPrefix}animemenu`,
                `${usedPrefix}bible`,
                `${usedPrefix}lang`,
                `${usedPrefix}botinfo`,
                `${usedPrefix}script`,
                `${usedPrefix}status`,
                `${usedPrefix}join <wagp_url>`,
                `${usedPrefix}fixwaitingmsg`,
                `bot (no prefix)`
            ],
            'jadibot': [
                `${usedPrefix}serbot --code`
            ],
            'xp': [
                `${usedPrefix}chest`,
                `${usedPrefix}balance`,
                `${usedPrefix}claim`,
                `${usedPrefix}leaderboard`,
                `${usedPrefix}myns`,
                `${usedPrefix}profile`,
                `${usedPrefix}crime`
            ],
            'game': [
                `${usedPrefix}math <noob/easy/medium/hard/extreme/impossible/impossible2>`,
                `${usedPrefix}rps <rock/paper/scissors>`,
                `${usedPrefix}suitpvp <@tag>`,
                `${usedPrefix}ttt`,
                `${usedPrefix}delttt`,
                `${usedPrefix}akinator`,
                `${usedPrefix}wordfind`,
                `${usedPrefix}song`,
                `${usedPrefix}hint`,
                `${usedPrefix}glx (RPG World)`,
                `${usedPrefix}dox <name / @tag>`
            ],
            'group': [
                `${usedPrefix}grouptime <time>`,
                `${usedPrefix}enable welcome`,
                `${usedPrefix}disable welcome`,
                `${usedPrefix}enable hornymode`,
                `${usedPrefix}disable hornymode`,
                `${usedPrefix}enable antilink`,
                `${usedPrefix}disable antilink`,
                `${usedPrefix}enable antilink2`,
                `${usedPrefix}disable antilink2`,
                `${usedPrefix}enable detect`,
                `${usedPrefix}disable detect`,
                `${usedPrefix}enable audios`,
                `${usedPrefix}disable audios`,
                `${usedPrefix}enable autosticker`,
                `${usedPrefix}disable autosticker`,
                `${usedPrefix}enable antiviewonce`,
                `${usedPrefix}disable antiviewonce`,
                `${usedPrefix}enable antitoxic`,
                `${usedPrefix}disable antitoxic`,
                `${usedPrefix}enable antispam`,
                `${usedPrefix}disable antispam`,
                `${usedPrefix}enable antiarab`,
                `${usedPrefix}disable antiarab`,
                `${usedPrefix}enable adminmode`,
                `${usedPrefix}disable adminmode`,
                `${usedPrefix}enable antidelete`,
                `${usedPrefix}disable antidelete`
            ],
            'downloader': [
                `${usedPrefix}spotify <txt>`,
                `${usedPrefix}playdoc <txt>`,
                `${usedPrefix}ytmp3doc <url>`,
                `${usedPrefix}ytmp4doc <url>`,
                `${usedPrefix}facebook <url>`,
                `${usedPrefix}instagram <url>`,
                `${usedPrefix}tiktok <url>`,
                `${usedPrefix}tiktokimg <url>`,
                `${usedPrefix}pptiktok <usr>`,
                `${usedPrefix}mediafire <url>`,
                `${usedPrefix}gitclone <url>`,
                `${usedPrefix}gdrive <url>`,
                `${usedPrefix}twitter <url>`,
                `${usedPrefix}ringtone <txt>`,
                `${usedPrefix}soundcloud <txt>`,
                `${usedPrefix}stickerpack <url>`,
                `${usedPrefix}dapk2 <url>`
            ],
            'search': [
                `${usedPrefix}modapk <txt>`,
                `${usedPrefix}stickersearch <txt>`,
                `${usedPrefix}stickersearch2 <txt>`,
                `${usedPrefix}animeinfo <txt>`,
                `${usedPrefix}cuevana <text>`,
                `${usedPrefix}cuevanaInfo <link>`
            ],
            'effects': [
                `${usedPrefix}logos <effect> <txt>`,
                `${usedPrefix}logochristmas <txt>`,
                `${usedPrefix}logocorazon <txt>`,
                `${usedPrefix}pixelate`
            ],
            'img': [
                `${usedPrefix}wpmountain`,
                `${usedPrefix}pubg`,
                `${usedPrefix}wpgaming`,
                `${usedPrefix}wpaesthetic`,
                `${usedPrefix}wpaesthetic2`,
                `${usedPrefix}wprandom`,
                `${usedPrefix}wallhp`,
                `${usedPrefix}wpvehicle`,
                `${usedPrefix}wpmoto`,
                `${usedPrefix}coffee`,
                `${usedPrefix}pentol`,
                `${usedPrefix}cartoon`,
                `${usedPrefix}cyberspace`,
                `${usedPrefix}technology`,
                `${usedPrefix}doraemon`,
                `${usedPrefix}hacker`,
                `${usedPrefix}planet`,
                `${usedPrefix}randomprofile`
            ],
            'tools': [
                `${usedPrefix}ocr`,
                `${usedPrefix}inspect <wagc_url>`,
                `${usedPrefix}chatgpt <txt>`,
                `${usedPrefix}exploit <txt>`,
                `${usedPrefix}dall-e <txt>`,
                `${usedPrefix}spamwa <num|txt|count>`,
                `${usedPrefix}readviewonce <img/video>`,
                `${usedPrefix}weather <country> <city>`,
                `${usedPrefix}poll <txt1|txt2>`,
                `${usedPrefix}whatmusic <audio>`,
                `${usedPrefix}readqr <img>`,
                `${usedPrefix}styletext <txt>`,
                `${usedPrefix}nowa <num>`,
                `${usedPrefix}covid <country>`,
                `${usedPrefix}schedule`,
                `${usedPrefix}igstalk <usr>`,
                `${usedPrefix}del <msg>`
            ],
            'converter': [
                `${usedPrefix}toptt <video / audio>`
            ],
            'sticker': [
                `${usedPrefix}scircle <img>`,
                `${usedPrefix}sremovebg <img>`,
                `${usedPrefix}semoji <type> <emoji>`,
                `${usedPrefix}attp2 <txt>`,
                `${usedPrefix}attp3 <txt>`,
                `${usedPrefix}ttp2 <txt>`,
                `${usedPrefix}ttp3 <txt>`,
                `${usedPrefix}ttp4 <txt>`,
                `${usedPrefix}ttp5 <txt>`,
                `${usedPrefix}slap <@tag>`,
                `${usedPrefix}pat <@tag>`,
                `${usedPrefix}kiss <@tag>`,
                `${usedPrefix}dice`,
                `${usedPrefix}stickermarker <effect> <img>`,
                `${usedPrefix}stickerfilter <effect> <img>`
            ],
            'owner': [
                `${usedPrefix}dsowner`,
                `${usedPrefix}autoadmin`,
                `${usedPrefix}leavegc`,
                `${usedPrefix}addowner <@tag / num>`,
                `${usedPrefix}delowner <@tag / num>`,
                `${usedPrefix}block <@tag / num>`,
                `${usedPrefix}unblock <@tag / num>`,
                `${usedPrefix}enable restrict`,
                `${usedPrefix}disable restrict`,
                `${usedPrefix}enable autoread`,
                `${usedPrefix}disable autoread`,
                `${usedPrefix}enable public`,
                `${usedPrefix}disable public`,
                `${usedPrefix}enable pconly`,
                `${usedPrefix}disable pconly`,
                `${usedPrefix}enable gconly`,
                `${usedPrefix}disable gconly`,
                `${usedPrefix}enable anticall`,
                `${usedPrefix}disable anticall`,
                `${usedPrefix}enable antiprivate`,
                `${usedPrefix}disable antiprivate`,
                `${usedPrefix}enable jadibotmode`,
                `${usedPrefix}disable jadibotmode`,
                `${usedPrefix}enable bot_audios`,
                `${usedPrefix}disable bot_audios`,
                `${usedPrefix}enable antispam`,
                `${usedPrefix}disable antispam`,
                `${usedPrefix}resetuser <@tag>`,
                `${usedPrefix}banuser <@tag>`,
                `${usedPrefix}givediamonds <@tag> <amount>`,
                `${usedPrefix}addxp <@tag> <amount>`,
                `${usedPrefix}bcbot <txt>`,
                `${usedPrefix}cleartpm`,
                `${usedPrefix}banlist`,
                `${usedPrefix}addprem2 <@tag> <time>`,
                `${usedPrefix}addprem3 <@tag> <time>`,
                `${usedPrefix}addprem4 <@tag> <time>`,
                `${usedPrefix}listcmd`,
                `${usedPrefix}addcmd <txt>`,
                `${usedPrefix}delcmd`,
                `${usedPrefix}msg <txt>`,
                `${usedPrefix}setppbot <reply to img>`
            ]
        };

        let user = global.db.data.users[m.sender];
        let { exp, limit, level, role, money, joincount } = user;

        const defaultMenu = {
            before: (translator.menu_header || '')
                .replace('@username', username)
                .replace('@author', global.author || 'Unknown')
                .replace('@owner', global.owner?.[0]?.[0] || '000000000000')
                .replace('@week', week)
                .replace('@date', date)
                .replace('@uptime', uptime)
                .replace('@rtotal', rtotal)
                .replace('@rtotalreg', rtotalreg),

            user_info: '\n' + (translator.user_info || '')
                .replace('@level', level)
                .replace('@exp', exp)
                .replace('@role', role || 'New')
                .replace('@limit', limit)
                .replace('@money', money)
                .replace('@joincount', joincount)
                .replace('@premium', user.premiumTime > 0 ? 
                    (translator.premium?.yes || '✅') : 
                    (isPrems ? (translator.premium?.yes || '✅') : (translator.premium?.no || '❌'))),

            header: (translator.section_header).replace('@category', '%category'),
            body: (translator.command_item).replace('@cmd', '%cmd').replace('@islimit', '%islimit'),
            footer: translator.section_footer,
            after: ''
        };

        let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => {
            return {
                help: Array.isArray(plugin.help) ? plugin.help : [plugin.help],
                tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
                prefix: 'customPrefix' in plugin,
                limit: plugin.limit,
                enabled: !plugin.disabled,
            }
        });

        conn.menu = conn.menu || {};
        let before = conn.menu.before || defaultMenu.before + '\n' + defaultMenu.user_info;
        let header = conn.menu.header || defaultMenu.header;
        let body = conn.menu.body || defaultMenu.body;
        let footer = conn.menu.footer || defaultMenu.footer;
        let after = conn.menu.after || defaultMenu.after;

        let _text = [
            before,
            readMore,    
            ...Object.keys(tags).map(tag => {
                let pluginCommands = help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
                    return menu.help.map(help => {
                        return body.replace(/%cmd/g, menu.prefix ? help : '%p' + help)
                            .replace(/%islimit/g, menu.limit ? '⭐' : '')
                            .trim()
                    }).join('\n')
                });

                let categoryCommands = [...pluginCommands];

                if (extrasCommands[tag]) {
                    let existingCommands = new Set();
                    pluginCommands.forEach(cmdGroup => {
                        cmdGroup.split('\n').forEach(line => {
                            let match = line.match(/□\s+(.+)/);
                            if (match) {
                                let cmd = match[1].replace(/%p/g, usedPrefix).split(' ')[0];
                                existingCommands.add(cmd);
                            }
                        });
                    });

                    let filteredExtras = extrasCommands[tag].filter(extraCmd => {
                        let baseCmd = extraCmd.split(' ')[0];
                        return !existingCommands.has(baseCmd);
                    });

                    if (filteredExtras.length > 0) {
                        categoryCommands.push(
                            ...filteredExtras.map(cmd => 
                                body.replace(/%cmd/g, cmd).replace(/%islimit/g, '').trim()
                            )
                        );
                    }
                }

                return categoryCommands.length > 0 
                    ? header.replace(/%category/g, tags[tag] || tag.toUpperCase()) + '\n' + categoryCommands.join('\n') + '\n' + footer
                    : '';
            }).filter(section => section !== ''),
            after
        ].join('\n');

        let text = typeof conn.menu == 'string' ? conn.menu : typeof conn.menu == 'object' ? _text : '';
        let replace = {
            '%': '%',
            p: usedPrefix,
            taguser: '@' + m.sender.split("@s.whatsapp.net")[0],
            me: conn.getName(conn.user.jid),
            name: await conn.getName(m.sender)
        };

        text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name]);

        let pp;
        const imageMap = {'es': global.imagen1, 'en': global.imagen4, 'ar': global.imagen5 };

        pp = imageMap[language.toLowerCase()] || global.imagen4;

        await conn.sendMessage(m.chat, { image: pp , caption: text.trim(), mentions: [m.sender] }, { quoted: m });
    } catch (e) {
        await m.reply(`${translator?.error_message} ${e.message}`);
    }
};

handler.help = ['menu'];
handler.tags = ['info'];
handler.command = /^(menu|help|commands|cmd|cmds)$/i;
export default handler;

function clockString(ms) {
    const h = isNaN(ms) ? '--' : Math.floor(ms / 3600000);
    const m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
    const s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
    return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':');
}