import fs from 'fs-extra'
import simpleGit from 'simple-git'

const handler = async (m, { conn, args, usedPrefix, command }) => {
    createDataBase() // Create a database file if it does not exist.
    atualizarRepositorio() // Check if an update is needed by querying the API at https://github.com/jeffersonalionco/database-galaxia/blob/master/database.json

    let infoDataHora = new Date()
    let horasEminutosAtual = `${infoDataHora.getHours()}:${infoDataHora.getMinutes()}`
    let horaAtual = infoDataHora.getHours()
    let minutoAtual = infoDataHora.getMinutes()

    let id
    if (m.chat) { id = m.chat } else { id = m.sender } // Define the chat ID in which you are currently conversing.

    let argumento = args[0]
    if (argumento != null && argumento != undefined) { argumento.toLowerCase() }
    let argumento1 = args[1]
    if (argumento1 != null && argumento1 != undefined) { argumento1.toLowerCase() }
    let argumento2 = args[2]
    if (argumento2 != null && argumento2 != undefined) { argumento2.toLowerCase() }

    try {
        // Read Bot and game database
        let data = global.db.data.users[m.sender].gameglx
        let db = JSON.parse(fs.readFileSync(`./src/assets/glx/db/database.json`))

        setInterval(() => {
            verificacaoXp() // Check player's XP
        }, 5000)

        if (args[0] === null || args[0] === undefined) {
            criarGrupo() // Verify if game groups work; if not, create one automatically

            const str = `*╔═ 🪐 GALAXY GAME 🪐 ═╗*

 👨‍🚀 Hello *${m.pushName}*, it's time to travel through space, mine asteroids, chat with aliens, and more in the galactic world!

  *💰 Currency:* ${data.perfil.carteira.currency}

  *🌠 ${usedPrefix}glx _register_*
  _To register in GLX_
  
  *🌠 ${usedPrefix}glx _profile_*
  _Check your profile progress._

> 🧾 Attacks / Defense / Travel

  *🌠 ${usedPrefix}glx _attack list_*
  _List all players in the game!_

  *🌠 ${usedPrefix}glx _attack <player_username>_*
  _Attack a user using their username!_

  *🌠 ${usedPrefix}glx _planet_*
  _Update Planet and Colony data_

  *🌠 ${usedPrefix}glx _travel_*
  _Want to visit another planet? Let's go!_

> 🧾 Mining Options

*🌠 ${usedPrefix}glx _mine_*
_Want money? Let's mine._

> 🧾 Personal Information 

  *🌠 ${usedPrefix}glx _wallet_*
  _Access your financial wallet._

  *🌠 ${usedPrefix}glx _shop_*
  _Discover our galaxy shop_

  *🌠 ${usedPrefix}glx _inventory_*
  _View your stored items_

  *🌟 ${usedPrefix}glx _creator_*
  _Information about the game creator._

  *🌟 ${usedPrefix}glx _about_*
  _About the game._

  _News and automatic updates_
  _For questions, contact us_

*╘═══════════════════╛*
  🌞🌕🌠🌟⭐🌎🪐
`
            let glx_menu = fs.readFileSync('./src/assets/images/menu/main/galaxiaMenu.png')
            const selo1234 = { 'key': { 'participants': '0@s.whatsapp.net', 'remoteJid': 'status@broadcast', 'fromMe': false, 'id': 'Halo' }, 'message': { 'contactMessage': { 'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` } }, 'participant': '0@s.whatsapp.net' };
            const idmessage = await conn.sendMessage(m.chat, { image: glx_menu, caption: str.trim() }, { quoted: selo1234 });
            const reactionMessage = { react: { text: "👨‍🚀", key: idmessage.key } }

            await conn.sendMessage(m.chat, reactionMessage)
        } else {
            criarGrupo() // Verify game groups

            if (data.status === false) {
                switch (argumento.toLowerCase()) {
                    case "register":
                        // Essential data for the game to run correctly.
                        data.status = true; // Activate player registration
                        data.perfil.nome = m.pushName // Save WhatsApp name in the game
                        data.perfil.id = m.sender // Save WhatsApp ID

                        // Set default home
                        data.perfil.casa.id = db.planetas.terra.id // Default Planet ID for new players
                        data.perfil.casa.planeta = db.planetas.terra.nomeplaneta // Default Planet Name
                        data.perfil.casa.colonia.nome = db.planetas.terra.colonias.colonia1.nome // Default Colony
                        data.perfil.casa.colonia.id = db.planetas.terra.colonias.colonia1.id // Default group ID
                        data.perfil.casa.idpelonome = db.planetas.terra.idpelonome // Default system name ID
                        db.planetas.terra.habitantes.push(m.sender) // Add user as an inhabitant of Earth

                        // Update user location globally
                        data.perfil.localizacao.status = true;
                        data.perfil.localizacao.nomeplaneta = db.planetas.terra.nomeplaneta;
                        data.perfil.localizacao.id = db.planetas.terra.id;
                        data.perfil.localizacao.idpelonome = db.planetas.terra.idpelonome;

                        // Register Username and save to db/data
                        let numb = await fNumeroAleatorio(3000, 1)
                        data.perfil.username = `user${numb}`
                        if (!db.user_cadastrado.username.includes(data.perfil.username)) {
                            let dados = {
                                id: data.perfil.id,
                                username: data.perfil.username
                            }
                            db.user_cadastrado.username.push(dados)
                        }

                        // Add user to the registered list and colony
                        if (!db.user_cadastrado.lista.includes(m.sender)) {
                            db.planetas.terra.colonias.colonia1.habitantes.push(m.sender)
                            db.user_cadastrado.lista.push(m.sender)
                            fs.writeFileSync(`./src/assets/glx/db/database.json`, JSON.stringify(db))
                        }

                        let status = data.status === true ? 'Active' : 'Inactive'
                        let nave = data.perfil.bolsa.naves.status === true ? 'Yes' : 'No'
                        let username = data.perfil.username === null ? 'No username' : `@${data.perfil.username}`

                        let maxX = db.planetas.terra.colonias.colonia1.localizacao.x + 150
                        let minX = db.planetas.terra.colonias.colonia1.localizacao.x - 1
                        let maxY = db.planetas.terra.colonias.colonia1.localizacao.y + 150
                        let minY = db.planetas.terra.colonias.colonia1.localizacao.y - 1

                        cadastrarPosicaoNoMapa(maxX, minX, maxY, minY, 'terra', 'colonia1')
                        conn.groupParticipantsUpdate(db.planetas.terra.id, [m.sender], "add")

                        enviar(`*_⚔️ YOU ARE NOW A STELLAR MEMBER 🪐_*

Your galactic info!
                        
*🧑Name: _${m.pushName}_*
*🌐Username: _${username}_*
*⏹️Status: _${status}_* 
*🚀Has ship: _${nave}_*

\`\`\`🏠 Current Home:\`\`\`
*🪐Planet: _${data.perfil.casa.planeta}_*
*🏠Colony: _${data.perfil.casa.colonia.nome}_*

Configuration Commands:
*${usedPrefix}glx set name* - name
*${usedPrefix}glx set username* - username

Group Commands (Planet):
*${usedPrefix}glx planet act* - Update colony data.

╔════════════════════╗

 *_⚙️ ALL COMMANDS_*
Use: ${usedPrefix}glx

╚════════════════════╝

*_🛸 GALAXY GAME 🛸_*
`)
                        // Developer-only notification
                        conn.sendMessage('529996125657@s.whatsapp.net', { text: `New user registered: \n\nID: ${data.perfil.id} \n\nName: ${data.perfil.id}`})
                        break;
                    default:
                        enviar10s(`_😢You need to register for the game_\n\n> Use *${usedPrefix}glx register* \n_To register._\n\n😁 *Register now, don’t waste time.*`)
                        break;
                }
            } else if (data.status === true) {
                notificacao() // Code change notifications
                switch (argumento.toLowerCase()) {
                    case 'register':
                        enviar10s(`_😁 Hello *${m.pushName}*, you are already registered._`)
                        break
                    case "travel":
                        if (data.perfil.bolsa.naves.status === false) return enviar10s(`*( ❌ ) You don’t have a ship* \n\n Use *${usedPrefix}glx buy ship n1* - To buy your first ship!\n\n_Or check other ship models🏪 in the shop:_ *${usedPrefix}glx shop*`)
                        switch (argumento1) {
                            case "earth":
                                if (data.perfil.casa.id === db.planetas[argumento1].id) return enviar10s(`*${data.perfil.casa.planeta}* _⚠️This planet is your home; you’re already here._`)
                                entrarplaneta('earth')
                                break;
                            case "megatron":
                                if (data.perfil.casa.id === db.planetas[argumento1].id) return enviar10s(`*${data.perfil.casa.planeta}* _⚠️ This planet is your home; you’re already here._`)
                                entrarplaneta(argumento1.toLowerCase())
                                break;
                            case 'home':
                                data.perfil.localizacao.viajando = false;
                                conn.groupParticipantsUpdate(data.perfil.casa.id, [m.sender], "add")
                                enviar(` 😉 *Hello!!!* again ${m.pushName}`, null, data.perfil.casa.id)
                                enviar(`${m.pushName} _You’re back on Earth 😉!_ `, null, id)
                                break;
                            default:
                                let str = `
╔════════════════════╗

*PLACES TO TRAVEL*

> --- PLANETS    
*✈️ ${usedPrefix}glx travel earth*
_A beautiful planet!_

*✈️ ${usedPrefix}glx travel megatron*
_A hostile planet with aggressive features!_

> --- USEFUL COMMANDS
*⚙️ ${usedPrefix}glx travel home*
_If your ship breaks down, use this command to return_

*_⚙️ ALL COMMANDS_*
Use: ${usedPrefix}glx

╚════════════════════╝

*_🛸 GALAXY GAME 🛸_*
`
                                enviar(str)
                                break;
                        }
                        break;
                    case 'buy':
                    case 'shop':
                        switch (argumento1) {
                            case 'ship':
                                switch (argumento2) {
                                    case 'n1':
                                        comprarnave(argumento2)
                                        break;
                                    case "n2":
                                        comprarnave(argumento2)
                                        break;
                                    default:
                                        m.reply(`*--- 🏪 SHIP MODELS ---*
\n_Models:_
 *➥ n1* - SHIP N1
 💨 Speed: *${db.naves.n1.velocidade}*
 ⚡ Combat Power: *${db.naves.n1.poder}*
 🎮(XP) Ship: *(${db.naves.n1.xp})*
 💸Ship Value: *${valorFormatado(db.naves.n1.valor)}*

 *➥ n2* - SHIP N2
 💨 Speed: *${db.naves.n2.velocidade}*
 ⚡ Combat Power: *${db.naves.n2.poder}*
 🎮(XP) Ship: *(${db.naves.n2.xp})*
 💸Ship Value: *${valorFormatado(db.naves.n2.valor)}*

 *➥ n3* - SHIP N3
 💨 Speed: *${db.naves.n3.velocidade}*
 ⚡ Combat Power: *${db.naves.n3.poder}*
 🎮(XP) Ship: *(${db.naves.n3.xp})*
 💸Ship Value: *${valorFormatado(db.naves.n3.valor)}*

Usage Example: *${usedPrefix}glx buy ship n1*

*_⚙️ ALL COMMANDS_*
Use: ${usedPrefix}glx

╚════════════════════╝

*_🛸 GALAXY GAME 🛸_*
`)
                                        break;
                                }
                                break;
                            default:
                                m.reply(`*--- 🏪 GALAXY SHOP ---*
                                
_Categories:_
↳ ship

Ex: To view ships:
*${usedPrefix}glx shop ship*

Ex: Buy a ship:
*${usedPrefix}glx buy ship n1*

╔════════════════════╗

 *_⚙️ ALL COMMANDS_*
Use: ${usedPrefix}glx

╚════════════════════╝

*_🛸 GALAXY GAME 🛸_*
`)
                                break;
                        }
                        break;
                    case "wallet":
                        if (m.isGroup === true) return enviar10s(`This command can only be used in private.`)
                        let img = './src/assets/glx/carteira.jpeg'
                        let str = `*-- 💴 FINANCIAL WALLET --* 
                        
_ℹ️ Your Info:_
*🏧Balance:* ${valorFormatado(data.perfil.carteira.saldo)}

_Want to earn money?_
Use ${usedPrefix}glx sell

╔════════════════════╗

 *_⚙️ ALL COMMANDS_*
Use: ${usedPrefix}glx

╚════════════════════╝

*_🛸 GALAXY GAME 🛸_*
`
                        enviar(str, img)
                        break;
                    case 'planet':
                        switch (argumento1) {
                            case 'act':
                                const colônias = db.planetas[data.perfil.casa.idpelonome].colonias
                                console.log(db.planetas[data.perfil.casa.idpelonome])
                                let dadoscolonias = ``
                                let Moradores1 = []
                                let Moradores2 = []

                                let str = `*Planet Data ${data.perfil.casa.planeta}*

*🏠Growing Colonies:*
${listarNomesColônias(data.perfil.casa.idpelonome)}

${dadoscolonias1()}

╔════════════════════╗

 *_⚙️ ALL COMMANDS_*
Use: ${usedPrefix}glx

╚════════════════════╝

*_🛸 GALAXY GAME 🛸_*
`

                                function dadoscolonias1() {
                                    for (let i = 0; i < Object.keys(colônias).length; i++) {
                                        const nomeColônia = colônias[Object.keys(colônias)[i]].nome;
                                        const habitantes = colônias[Object.keys(colônias)[i]].habitantes;

                                        let Moradores = '*- Inhabitants:*\n'
                                        Moradores += `Total: ${habitantes.length}\n`

                                        for (let j = 0; j < habitants.length; j++) {
                                            let your = ' '

                                            let numberr
                                            numberr = habitantes[j].replace(/\D/g, '')
                                            Moradores1.push(numberr)
                                            Moradores2.push(habitantes[j])

                                            if (habitantes[j] === m.sender) {
                                                your = ` *You* `
                                            }
                                            Moradores += `➣ ${your}@${numberr}\n`
                                        }

                                        dadoscolonias += `*${nomeColônia}*
${Moradores}
    
`
                                    }
                                    return dadoscolonias
                                }

                                function listarNomesColônias(planeta) {
                                    const colônias = db.planetas[planeta].colonias;
                                    const nomesColônias = Object.keys(colônias).map(nome => colônias[nome].nome);
                                    return nomesColônias.join("\n");
                                }

                                conn.sendMessage(id, { text: str, mentions: Moradores2 })
                                break;
                            case 'leave':
                                if (!m.isGroup) return m.reply(` You can only use this in groups`)
                                if (id != data.perfil.casa.id) {
                                    data.perfil.localizacao.viajando = false;
                                    conn.groupParticipantsUpdate(id, [m.sender], "remove")
                                    conn.groupParticipantsUpdate(data.perfil.casa.id, [m.sender], "add")
                                    conn.sendMessage(data.perfil.casa.id, { text: `_Welcome home!_` })
                                    conn.sendMessage(m.sender, { text: `_Welcome home!_` })
                                }
                                break;
                            default:
                                m.reply(`That doesn’t exist in the colony.`)
                                break;
                        }
                        break;
                    case 'inventory':
                    case 'bag':
                        let bolsa = data.perfil.bolsa
                        let itens = Object.keys(bolsa.itens)
                        let listaItens = ''
                        let texto = ""

                        for (let i = 0; i < itens.length; i++) {
                            listaItens += `*• _${itens[i]}_*  ➡︎ [ ${data.perfil.bolsa.itens[itens[i]]} ] \n`
                        }

                        texto = `╔═════════👜═════════╗\n\n*_📝 - ALL ITEMS_*\n\n> ⛏️ MINERALS:\n${listaItens}
 - Want to sell your items?
 Use *${usedPrefix}glx sell gold 10*                    

*_⚙️ ALL COMMANDS_*
Use: ${usedPrefix}glx

*_🛸 GALAXY GAME 🛸_*

  ╚═════════👜═════════╝`
                        enviar(texto, "./src/assets/glx/bau.jpg")
                        break;
                    case 'sell':
                        switch (argumento1) {
                            case 'wood':
                                vender(argumento1, argumento2)
                                break
                            case 'iron':
                                vender(argumento1, argumento2)
                                break
                            case 'diamond':
                                vender(argumento1, argumento2)
                                break
                            case 'emerald':
                                vender(argumento1, argumento2)
                                break
                            case 'coal':
                                vender(argumento1, argumento2)
                                break
                            case 'gold':
                                vender(argumento1, argumento2)
                                break
                            case 'quartz':
                                vender(argumento1, argumento2)
                                break
                            default:
                                let str = `* 🏪 PAWN SHOP*

_Items available for sale._ 

▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅
> MINING ITEMS ⤵

🛠️ *${usedPrefix}glx sell wood 1*
 - Unit Value: ${valorFormatado(db.itens.mineracao['wood'].valorVenda)}
                                
 🛠️ *${usedPrefix}glx sell iron 1*
- Unit Value: ${valorFormatado(db.itens.mineracao['iron'].valorVenda)}
                                
🛠️ *${usedPrefix}glx sell diamond 1*
- Unit Value: ${valorFormatado(db.itens.mineracao['diamond'].valorVenda)}
                                
🛠️ *${usedPrefix}glx sell emerald 1*
- Unit Value: ${valorFormatado(db.itens.mineracao['emerald'].valorVenda)} 

🛠️ *${usedPrefix}glx sell coal 1*
- Unit Value: ${valorFormatado(db.itens.mineracao['coal'].valorVenda)}
                                
🛠️ *${usedPrefix}glx sell gold 1*
- Unit Value: ${valorFormatado(db.itens.mineracao['gold'].valorVenda)}
                                
🛠️ *${usedPrefix}glx sell quartz 1*
- Unit Value: ${valorFormatado(db.itens.mineracao['quartz'].valorVenda)}
 
▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅

╔════════════════════╗

 *_⚙️ ALL COMMANDS_*
Use: ${usedPrefix}glx

╚════════════════════╝

*_🛸 GALAXY GAME 🛸_*
`
                                enviar(str, './src/assets/glx/transacao.jpg')
                                break;
                        }
                        break;
                    case 'mine':
                        if (argumento1 != null && argumento1 != undefined) { argumento1.toLowerCase() } else { argumento1 }
                        switch (argumento1) {
                            case 'stop':
                                data.perfil.minerando = false
                                m.reply(`*Mining stopped*`)
                                break
                            case 'wood':
                                minerar(argumento1)
                                break
                            case 'iron':
                                minerar(argumento1)
                                break
                            case 'diamond':
                                minerar(argumento1)
                                break
                            case 'emerald':
                                minerar(argumento1)
                                break
                            case 'coal':
                                minerar(argumento1)
                                break
                            case 'gold':
                                minerar(argumento1)
                                break
                            case 'quartz':
                                minerar(argumento1)
                                break
                            default:
                                let funcoes = `
*🌳${usedPrefix}glx mine stop*
_Use to stop mining._
`
                                let itens = `
*🌳${usedPrefix}glx mine wood*
_One of the main minerals, for selling or building houses._ 

*🔩${usedPrefix}glx mine iron*
_Mineral used to sell and buy ships._

*💎${usedPrefix}glx mine diamond*
_Very important mineral for earning money._

*🟢${usedPrefix}glx mine emerald*
_Very important mineral for earning money._

*⚫${usedPrefix}glx mine coal*
_Ideal for sale, fuel, or fire._

*🟡${usedPrefix}glx mine gold*
_High-value mineral for trade._

*⚪${usedPrefix}glx mine quartz*
_High-value mineral for trade._
`
                                enviar(`⛏️ *MINING OPTIONS* ⚒️
                                
> ⚙️ *SETTINGS*
${funcoes}

> ⛏️ *minerals*${itens}

╔════════════════════╗

 *_⚙️ ALL COMMANDS_*
Use: ${usedPrefix}glx

╚════════════════════╝

*_🛸 GALAXY GAME 🛸_*
`, "./src/assets/glx/miner.jpg")
                                break;
                        }
                        break;
                    case 'map':
                        enviar(`*Map* _was disabled in the game due to a Debiam error._`)
                        break;
                    case 'profile':
                        let nave = data.perfil.nave.nome ? data.perfil.nave.nome : 'No ship'
                        let strr = `*_🤖 ${data.perfil.nome} Your Profile!_*

This is your info in the \`\`\`GALAXY\`\`\` game.

_💡Don’t forget to mine, *${usedPrefix}glx mine* This increases your XP and strength.._

*🆙 XP:* _${data.perfil.xp} XP_
    *Next Level:* _${db.api.niveis[`nivel${data.perfil.nivel.proximoNivel}`].totalXp} XP_

*📈 Level:* _${data.perfil.nivel.nome}_
*💪 Power [Strength]:* _${data.perfil.poder}_ P
*⚔️ Attack Power:* _${data.perfil.ataque.forcaAtaque.ataque}_ P
*🛡️ Defense Power:* _${data.perfil.defesa.forca}_ P
*🌀 Username:* _${data.perfil.username}_

*🗣️ Language:* _${data.perfil.idioma}_
*💰 Currency:* _${data.perfil.carteira.currency}_

*🌏 Planet:* _${data.perfil.casa.planeta}_
*🏠 Colony:* _${data.perfil.casa.colonia.nome}_

*🛸 Your current ship:* _${nave}_

*_⚙️ ALL COMMANDS_*
Use: ${usedPrefix}glx
`
                        setTimeout(() => {
                            enviar(strr, `./src/assets/glx/perfil.png`)
                        }, 1000)
                        break;
                    case 'creator':
                        let msgcriador = `🛈 *CREATOR INFORMATION:*\n\n👨 *_Galaxy game creator:_*\nhttps://github.com/jeffersonalionco\n\n👨 *_BOT Creator:_*\nhttps://github.com/BrunoSobrino`
                        enviar(msgcriador)
                        break;
                    case 'attack':
                        switch (argumento1) {
                            case 'list':
                                let strr = `*_📚--- USER LIST ---📚_*\n\n*Use:*\n${usedPrefix}glx attack *<USERNAME>* - _To attack a player!_\n\n`
                                let mentionss = []
                                for (let i = 0; i < db.user_cadastrado.username.length; i++) {
                                    let db1 = global.db.data.users[db.user_cadastrado.username[i].id].gameglx
                                    let number = db.user_cadastrado.username[i].id.replace(/\D/g, '')

                                    strr += `👨‍🚀 *Name:* ${db1.perfil.nome} \n*🔎 Username:* ${db.user_cadastrado.username[i].username}\n*✍ User:* @${number}\n______________________\n\n`
                                    mentionss.push(db.user_cadastrado.username[i].id)
                                }
                                conn.sendMessage(data.perfil.id, { text: strr, mentions: mentionss })
                                break;
                            default:
                                atacar(argumento1)
                                break
                        }
                        break
                    case 'about':
                        let sobre = `
_Welcome to the help section_ *GALAXY*

*Game Objective*
The goal is to create an open world where players mine items, sell them for money, buy gear to strengthen themselves, and attack other players.

> *Game Steps*
*Exploration:* Navigate the open world and find mining locations.
*Mining:* Extract valuable items.
*Selling Items:* Sell mined items for money.
*Buying Items:* Use money to buy gear and increase power.
*Combat:* Attack other players with stronger items.

> *Tips*
    - Explore different areas for the best mining spots.
    - Invest in gear to boost mining efficiency.
    - Balance money between attack and defense items.
    - Form alliances for protection and trade.

Have fun mining, trading, and battling to become the strongest!
`
                        enviar(sobre)
                        break
                    default:
                        m.reply(`*[!]* Option *${args[0]}* doesn’t exist!`)
                        break
                }
            }
        }

        //-----------------------------------------------------------------------------------------------------------------
        // --------------------------- GALAXY GAME FUNCTIONS --------------------------------------------------------------
        //-----------------------------------------------------------------------------------------------------------------

        async function entrarplaneta(nomeplaneta) {
            if (data.perfil.localizacao.viajando === true) return m.reply(`_You’re already traveling; wait for the timer or type_ *${usedPrefix}glx travel home*`)

            data.perfil.localizacao.viajando = true;

            let temponacidade = 30000
            let tempodeviagem = data.perfil.nave.velocidade * 1000

            data.perfil.localizacao.status = true;
            data.perfil.localizacao.nomeplaneta = db.planetas[nomeplaneta].nomeplaneta;
            data.perfil.localizacao.id = db.planetas[nomeplaneta].id;
            data.perfil.localizacao.idpelonome = db.planetas[nomeplaneta].idpelonome;

            if (data.perfil.casa.planeta === nomeplaneta) {
                m.reply(`*${nomeplaneta} is already your home!*`)
            } else {
                db.planetas[nomeplaneta].colonias.colonia1.visitantes.push(id)
                fs.writeFileSync(`./src/assets/glx/db/database.json`, JSON.stringify(db))
            }

            const messageId1 = await conn.sendMessage(
                id, {
                video: fs.readFileSync("./src/assets/glx/viajando.mp4"),
                caption: `Traveling to planet ${nomeplaneta}!! Wait *${data.perfil.nave.velocidade}* seconds`,
                gifPlayback: true
            }
            );

            setTimeout(() => {
                let str = `*🌎 WELCOME TO ${nomeplaneta.toUpperCase()} 🌎*
                
_You’ve been added to the planet group_
                
\`\`\`If you’re in private chat, leave and go to planet Earth.\`\`\`

╔════════════════════╗

 *_⚙️ ALL COMMANDS_*
Use: ${usedPrefix}glx

╚════════════════════╝

*_🛸 GALAXY GAME 🛸_*
`
                let img = "./src/assets/glx/base_terra.webp"

                conn.sendMessage(db.planetas[nomeplaneta].id, { text: str });
                conn.sendMessage(id, { text: `You’ve entered planet ${nomeplaneta}, go on adventures` });

                conn.sendMessage(id, { delete: messageId1 });
                conn.groupParticipantsUpdate(db.planetas[nomeplaneta].id, [m.sender], "add")

                setTimeout(() => {
                    data.perfil.localizacao.viajando = false;

                    let index = db.planetas[nomeplaneta].colonias.colonia1.visitantes.indexOf(id)
                    db.planetas[nomeplaneta].colonias.colonia1.visitantes.splice(index, 1)
                    fs.writeFileSync(`./src/assets/glx/db/database.json`, JSON.stringify(db))

                    conn.reply(data.perfil.id, `*_Your ship’s time on planet ${data.perfil.localizacao.nomeplaneta} is up, your ship returned to space!_*`, m)

                    data.perfil.localizacao.status = false;
                    data.perfil.localizacao.nomeplaneta = data.perfil.casa.planeta;
                    data.perfil.localizacao.id = data.perfil.casa.id;
                    data.perfil.localizacao.idpelonome = data.perfil.casa.planeta;
                    setTimeout(() => {
                        conn.groupParticipantsUpdate(db.planetas[nomeplaneta].id, [m.sender], "remove")
                    }, 3000);
                }, temponacidade)
            }, tempodeviagem)
        }

        async function comprarnave(modelo) {
            if (data.perfil.bolsa.naves.compradas.includes(modelo)) return m.reply(`_😊 You already own this ship! Use *${usedPrefix}glx buy ship* to see other models!_`)
            if ((data.perfil.carteira.saldo - db.naves[modelo.toLowerCase()].valor) <= 0) return m.reply(`_😪 ${data.perfil.nome}! Insufficient balance._ \n\n*Your Balance:* ${valorFormatado(data.perfil.carteira.saldo)}\n*Ship ${modelo} Value:* ${valorFormatado(db.naves[modelo].valor)}\n\nSell minerals to earn money. Ex: *${usedPrefix}glx sell gold 2*`)

            let poderantigo = db.naves[modelo.toLowerCase()].poder
            let saldo = data.perfil.carteira.saldo - db.naves[modelo.toLowerCase()].valor
            data.perfil.carteira.saldo = saldo

            data.perfil.bolsa.naves.status = true
            data.perfil.bolsa.naves.compradas.push(modelo)
            fs.writeFileSync('./database.json', JSON.stringify(data))

            data.perfil.nave.id = db.naves[modelo.toLowerCase()].id
            data.perfil.nave.nome = db.naves[modelo.toLowerCase()].nome
            data.perfil.nave.velocidade = db.naves[modelo.toLowerCase()].velocidade
            data.perfil.nave.poder = db.naves[modelo.toLowerCase()].poder
            data.perfil.nave.valor = db.naves[modelo.toLowerCase()].valor
            data.perfil.poder += db.naves[modelo.toLowerCase()].poder

            let img = "./src/assets/glx/img_padrao.png"
            let str = `
_You bought the ship_ *${data.perfil.nave.nome}*

💨 Speed: *${db.naves[modelo.toLowerCase()].velocidade}*
⚡ Combat Power: *${db.naves[modelo.toLowerCase()].poder}*
💸Ship Value: *${db.naves[modelo.toLowerCase()].valor}*

*⚡-👑 Your Power increased:*
_From_ *${poderantigo}* _to_ *${data.perfil.poder}*

╔════════════════════╗

 *_⚙️ ALL COMMANDS_*
Use: ${usedPrefix}glx

╚════════════════════╝

*_🛸 GALAXY GAME 🛸_*

_Auto-deletion in 20 seconds_
`
            const messageId = await enviar(str, img)
            setTimeout(() => {
                conn.sendMessage(m.sender, { delete: messageId });
            }, 15000)
        }

        async function enviar10s(texto) {
            const messageId = await m.reply(texto + `\n\n_🔋 auto-deletion! 10s_`)
            setTimeout(() => {
                conn.sendMessage(m.sender, { delete: messageId })
            }, 10000)
        }

        async function enviar(texto, img, aux_id) {
            if (aux_id === null || aux_id === undefined) { aux_id = id }
            if (img === null || img === undefined) { img = './src/assets/glx/img_padrao.png' }

            let glx_menu = fs.readFileSync(img)
            const selo = { 'key': { 'participants': '0@s.whatsapp.net', 'remoteJid': 'status@broadcast', 'fromMe': false, 'id': 'Halo' }, 'message': { 'contactMessage': { 'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` } }, 'participant': '0@s.whatsapp.net' };
            const messageId = await conn.sendMessage(aux_id, { image: glx_menu, caption: texto.trim() }, { quoted: selo })
            return messageId

        }

        async function minerar(item) {
            if (m.isGroup && id != data.perfil.casa.id) return m.reply(`\n> [ ! ] ERROR - AVISO \n\n_You can only mine on the planet_ *(${data.perfil.casa.planeta})*`)
            if (data.perfil.minerando === true) return m.reply(`_You are already mining! If you want to stop, use *${usedPrefix}glx miner parar*_`)

            let tempoedit = db.itens.mineracao[item].tempoMineracao / 1000
            let cem = 0
            let messageId = await m.reply(`*Mining.. ⟲[0%]*`)
            data.perfil.minerando = true // Muda para status minerando..

            function rep() {
                cem += 10
                if (cem < 100) {
                    conn.sendMessage(id, { text: `*Mining..  [⟲ ${cem}%]*`, edit: messageId.key })
                } else if (cem === 100) {
                    conn.sendMessage(id, { text: `*Processing... [${cem}%] ⟲ Please wait* `, edit: messageId.key })



                }
            }
            let carregando = setInterval(rep, 1000)
            const gerarPoder = await fNumeroAleatorio(10, 5) // Gerar um numero de 5 a 10 

            setTimeout(() => {
                clearInterval(carregando)
                data.perfil.bolsa.itens[item] += db.itens.mineracao[item].quantidadeMinerado // adiciona os itens minerados
                data.perfil.minerando = false // Desativa status minerando..
                const numeroAleatorio = Math.floor(Math.random() * (40 - 10 + 1)) + 10; // Gerar um numero de 10 a 50
                data.perfil.xp += numeroAleatorio // Adicionando um valor aleatorio de Xp no novel do usuario 
                data.perfil.poder += gerarPoder // Adicionando um novo valor de poder gerado para o usuario
                data.perfil.poder += db.itens.mineracao[item].poder // Bonus de poder por mineração

                conn.sendMessage(id, {
                    text: `*⚒️Mining Finished [${tempoedit} _Segundos_]*
> You mined ${db.itens.mineracao[item].quantidadeMinerado} ${item} 

_🥳You earned a bonus:_ *${numeroAleatorio} [XP]*
_👑Your Power:_ ${data.perfil.poder}
_⚡You earned:_  ${db.itens.mineracao[item].poder} Puntos(poder)

*Total de ${item}:* [ ${data.perfil.bolsa.itens[item]} ]

*_${usedPrefix}glx bau_* - To see your mined items.`, edit: messageId.key
                })



            }, db.itens.mineracao[item].tempoMineracao)
        }
        function valorFormatado(valor) {
            const valorFormatado = (valor).toLocaleString(data.perfil.idioma, { style: 'currency', currency: data.perfil.carteira.currency });
            return valorFormatado
        }

        async function vender(argumento1, argumento2) {
            // Argumento 1 = Tipo de minerio que esta sendo vendido / argumento 2 a quantidade.
            if (!isNaN(argumento2) === false) return m.reply(`I need you to tell me the amount of ${argumento1} you want to sell in numbers`)
            if (argumento2 > data.perfil.bolsa.itens[argumento1]) return m.reply(`_you have not saved_ *[ ${argumento2} ${argumento1} ]* \n\n_Your current stock is:_ *[ ${data.perfil.bolsa.itens[argumento1]} ${argumento1} ]* \n\n To mine more use:\n> ${usedPrefix}glx miner`)
            let valorDeVenda = argumento2 * db.itens.mineracao[argumento1].valorVenda

            let valorDescontado = data.perfil.bolsa.itens[argumento1] - argumento2 // Diminuir a quantidade vendida de Minerios
            data.perfil.bolsa.itens[argumento1] = valorDescontado
            data.perfil.carteira.saldo += valorDeVenda // Adicionando novo saldo a carteira.

            // Bonus XP
            const numeroAleatorio = Math.floor(Math.random() * (20 - 5 + 1)) + 5;
            const gerarPoder = await fNumeroAleatorio(10, 5)

            data.perfil.xp += numeroAleatorio
            data.perfil.poder += gerarPoder * argumento2

            enviar(`*_🤝 Congratulations, Sale completed successfully!_*\n\n*you sold: ${argumento2} ${argumento1}*\n*Value per Unit: ${valorFormatado(db.itens.mineracao[argumento1].valorVenda)}*\n*You received: ${valorFormatado(valorDeVenda)}*\n\n*🎉XP Bonus: ${numeroAleatorio} XP*\n_👑 Your Power:_ ${data.perfil.poder} \n\nTo see your *Balance* use:\n> ${usedPrefix}glx carteira`, "./src/assets/glx/transacao.jpg")
        }

        async function verificacaoXp() {
            /** Esta Função quando chamada, altera o nivel do usuario
             *  1) Se o usuario atingir o XP de cada nivel
             * 
             * O que ele faz se atingir o xp do nivel?
             * 1) Ele defini a nova meta a ser alcançada ( EX:  data.perfil.nivel.proximoNivel += 1 )
             * 2) Altera o Nome do seu nivel anterior para o nivel atual ( EX: data.perfil.nivel.nome = db.api.niveis.nivel1.nome )
             * 3) Envia uma mensagem Personalizado, chamando a função msg() e passando os 3 parametros necessarios. Nome nivel atual, XP Atual, e Nome do proximo nivel
             */
            function msg(nomeNivel, xpAtual, proximoNivel) {
                let str = `
_🚀🎉 Congratulations, captain. ${data.perfil.nome}! 🎉🚀_

You have reached the XP limit and advanced to the next level en nuestra aventura intergaláctica.!
            
*🌟 Current Level:*  ${nomeNivel}
*🎮 Current XP:*  ${xpAtual}
*🎖️ Next Level:* ${proximoNivel}

💥 Recompensas:
- You gained *${db.api.niveis[`nivel${data.perfil.nivel.id}`].defesa}* Points of *_Defense_*.
- You gained *${db.api.niveis[`nivel${data.perfil.nivel.id}`].ataque}* Points of *_Attack_*.
- New abilities unlocked
- Access to secret space areas 
- Intergalactic allies

╔════════════════════╗

 *_⚙️ ALL COMMANDS_*
Use: ${usedPrefix}glx

╚════════════════════╝

*_🛸  GALAXY GAME 🛸_*
`
                enviar(str, './src/assets/glx/parabens.jpg', data.perfil.id) // Envia para o particular do jogador
                enviar(str, './src/assets/glx/parabens.jpg', data.perfil.casa.id) // Envia para o planeta casa do jogador


            }
            if (data.perfil.xp >= db.api.niveis.nivel1.totalXp && data.perfil.nivel.proximoNivel === db.api.niveis.nivel1.id) {

                data.perfil.nivel.proximoNivel += 1 // definido id do proximo nivel
                data.perfil.nivel.id = db.api.niveis.nivel1.id // Defininfo o id atual do nivel
                data.perfil.nivel.nome = db.api.niveis.nivel1.nome
                data.perfil.defesa.forca += db.api.niveis.nivel1.defesa
                data.perfil.defesa.ataque += db.api.niveis.nivel1.ataque
                data.perfil.ataque.forcaAtaque.ataque += data.perfil.defesa.ataque
                msg(db.api.niveis.nivel1.nome, data.perfil.xp, db.api.niveis.nivel2.nome)

            } else if (data.perfil.xp >= db.api.niveis.nivel2.totalXp && data.perfil.nivel.proximoNivel === db.api.niveis.nivel2.id) {

                data.perfil.nivel.proximoNivel += 1 // definido id do proximo nivel
                data.perfil.nivel.id = db.api.niveis.nivel2.id
                data.perfil.nivel.nome = db.api.niveis.nivel2.nome
                data.perfil.defesa.forca += db.api.niveis.nivel2.defesa
                data.perfil.defesa.ataque += db.api.niveis.nivel2.ataque
                data.perfil.ataque.forcaAtaque.ataque += data.perfil.defesa.ataque
                msg(db.api.niveis.nivel2.nome, data.perfil.xp, db.api.niveis.nivel3.nome)

            } else if (data.perfil.xp >= db.api.niveis.nivel3.totalXp && data.perfil.nivel.proximoNivel === db.api.niveis.nivel3.id) {

                data.perfil.nivel.proximoNivel += 1 // definido id do proximo nivel
                data.perfil.nivel.id = db.api.niveis.nivel3.id
                data.perfil.nivel.nome = db.api.niveis.nivel3.nome
                data.perfil.defesa.forca += db.api.niveis.nivel3.defesa
                data.perfil.defesa.ataque += db.api.niveis.nivel3.ataque
                data.perfil.ataque.forcaAtaque.ataque += data.perfil.defesa.ataque
                msg(db.api.niveis.nivel3.nome, data.perfil.xp, db.api.niveis.nivel4.nome)

            } else if (data.perfil.xp >= db.api.niveis.nivel4.totalXp && data.perfil.nivel.proximoNivel === db.api.niveis.nivel4.id) {

                data.perfil.nivel.proximoNivel += 1 // definido id do proximo nivel
                data.perfil.nivel.id = db.api.niveis.nivel4.id
                data.perfil.defesa.forca += db.api.niveis.nivel4.defesa
                data.perfil.defesa.ataque += db.api.niveis.nivel4.ataque
                data.perfil.ataque.forcaAtaque.ataque += data.perfil.defesa.ataque
                data.perfil.nivel.nome = db.api.niveis.nivel4.nome

                msg(db.api.niveis.nivel4.nome, data.perfil.xp, db.api.niveis.nivel5.nome)

            } else if (data.perfil.xp >= db.api.niveis.nivel5.totalXp && data.perfil.nivel.proximoNivel === db.api.niveis.nivel5.id) {

                data.perfil.nivel.proximoNivel += 1 // definido id do proximo nivel
                data.perfil.nivel.id = db.api.niveis.nivel5.id
                data.perfil.defesa.forca += db.api.niveis.nivel5.defesa
                data.perfil.defesa.ataque += db.api.niveis.nivel5.ataque
                data.perfil.ataque.forcaAtaque.ataque += data.perfil.defesa.ataque
                data.perfil.nivel.nome = db.api.niveis.nivel5.nome

                msg(db.api.niveis.nivel5.nome, data.perfil.xp, db.api.niveis.nivel6.nome)

            } else if (data.perfil.xp >= db.api.niveis.nivel6.totalXp && data.perfil.nivel.proximoNivel === db.api.niveis.nivel6.id) {

                data.perfil.nivel.proximoNivel += 1 // definido id do proximo nivel
                data.perfil.nivel.id = db.api.niveis.nivel6.id
                data.perfil.nivel.nome = db.api.niveis.nivel6.nome
                data.perfil.defesa.forca += db.api.niveis.nivel6.defesa
                data.perfil.defesa.ataque += db.api.niveis.nivel6.ataque
                data.perfil.ataque.forcaAtaque.ataque += data.perfil.defesa.ataque
                msg(db.api.niveis.nivel6.nome, data.perfil.xp, db.api.niveis.nivel7.nome)

            } else if (data.perfil.xp >= db.api.niveis.nivel7.totalXp && data.perfil.nivel.proximoNivel === db.api.niveis.nivel7.id) {

                data.perfil.nivel.proximoNivel += 1 // definido id do proximo nivel
                data.perfil.nivel.id = db.api.niveis.nivel7.id
                data.perfil.defesa.forca += db.api.niveis.nivel7.defesa
                data.perfil.defesa.ataque += db.api.niveis.nivel7.ataque
                data.perfil.ataque.forcaAtaque.ataque += data.perfil.defesa.ataque
                data.perfil.nivel.nome = db.api.niveis.nivel7.nome
                msg(db.api.niveis.nivel7.nome, data.perfil.xp, db.api.niveis.nivel8.nome)


            } else if (data.perfil.xp >= db.api.niveis.nivel8.totalXp && data.perfil.nivel.proximoNivel === db.api.niveis.nivel8.id) {

                data.perfil.nivel.proximoNivel += 1 // definido id do proximo nivel
                data.perfil.nivel.id = db.api.niveis.nivel8.id
                data.perfil.nivel.nome = db.api.niveis.nivel8.nome
                data.perfil.defesa.forca += db.api.niveis.nivel8.defesa
                data.perfil.defesa.ataque += db.api.niveis.nivel8.ataque
                data.perfil.ataque.forcaAtaque.ataque += data.perfil.defesa.ataque
                msg(db.api.niveis.nivel8.nome, data.perfil.xp, db.api.niveis.nivel9.nome)

            } else if (data.perfil.xp >= db.api.niveis.nivel9.totalXp && data.perfil.nivel.proximoNivel === db.api.niveis.nivel9.id) {

                data.perfil.nivel.proximoNivel += 1 // definido id do proximo nivel
                data.perfil.nivel.id = db.api.niveis.nivel9.id
                data.perfil.nivel.nome = db.api.niveis.nivel9.nome
                data.perfil.defesa.forca += db.api.niveis.nivel9.defesa
                data.perfil.defesa.ataque += db.api.niveis.nivel9.ataque
                data.perfil.ataque.forcaAtaque.ataque += data.perfil.defesa.ataque
                msg(db.api.niveis.nivel9.nome, data.perfil.xp, db.api.niveis.nivel10.nome)

            } else if (data.perfil.xp >= db.api.niveis.nivel10.totalXp && data.perfil.nivel.proximoNivel === db.api.niveis.nivel10.id) {

                data.perfil.nivel.proximoNivel += 1 // definido id do proximo nivel
                data.perfil.nivel.id = db.api.niveis.nivel10.id
                data.perfil.defesa.forca += db.api.niveis.nivel10.defesa
                data.perfil.defesa.ataque += db.api.niveis.nivel10.ataque
                data.perfil.ataque.forcaAtaque.ataque += data.perfil.defesa.ataque
                data.perfil.nivel.nome = db.api.niveis.nivel10.nome
                msg(db.api.niveis.nivel10.nome, data.perfil.xp, "REY DEL NIVEL")


            }
        }

        async function criarGrupo() {
            /*Esta Função Cria um grupo para cada planeta cadastrado no database do glx. Para realizar esta opeção tem algumas condições para ser seguidas
            1) Só ira criar o grupo se a consulta ao id no database retornar null
            2) Caso o grupo que esteja cadastrado no database, não tenha permisão de adm para o bot, ele criara outro grupo, e adicionara os habitantes

            Depois de Criar um grupo, sera alterado:
            1) o id do planeta de NUll para o novo id do grupo criado no database
            2) Ira adicinar o id do novo grupo ao perfil de cada habitante SE a casa dele for o planeta(Grupo) novo criado.
            3) Ira setar que só adm pode editar conf do grupo
            4) Desativa o welcome dos grupos criados
            
            */
            let erroAdmin = false // So sera usado se o bot não for administrado do grupo planeta
            let idGrupoAntigo  // So sera usado se o bot não for administrado do grupo planeta

            let planetas = Object.keys(db.planetas)
            let nomePlaneta
            let idPlaneta
            let habitantesPlaneta

            for (let i = 0; i < planetas.length; i++) {
                let idd = db.planetas[planetas[i]].id
                if (idd === null) {

                } else {
                    if (await verificacaoAdmin(idd) === false) {
                        erroAdmin = true
                        idGrupoAntigo = db.planetas[planetas[i]].id

                        db.planetas[planetas[i]].id = null
                        fs.writeFileSync('./src/assets/glx/db/database.json', JSON.stringify(db))
                    }

                }

                nomePlaneta = db.planetas[planetas[i]].nomeplaneta
                idPlaneta = db.planetas[planetas[i]].id
                habitantesPlaneta = db.planetas[planetas[i]].habitantes

                if (db.planetas[planetas[i]].id === null) {

                    const group = await conn.groupCreate(nomePlaneta, habitantesPlaneta)
                    await conn.groupUpdateSubject(group.id, `[GAME] Planeta ${nomePlaneta}`) // Alterar o nome 
                    await conn.groupSettingUpdate(group.id, 'locked') // Só administrador pode alterar os dados do grupos
                    await conn.updateProfilePicture(group.id, { url: `${db.planetas[planetas[i]].imgPerfil}` }) // Alterar a imagem do gruppoS

                    global.db.data.chats[group.id].welcome = false; // Desativando Welcome dos grupos
                    db.planetas[planetas[i]].id = group.id // Define o id do planeta como o id do grupo recem criado.
                    fs.writeFileSync('./src/assets/glx/db/database.json', JSON.stringify(db)) // Grava os dados
                    conn.sendMessage(group.id, { text: `hello there ${group.id}` }) //  Envia uma mensagem ao grupoSS

                    if (erroAdmin === true) {
                        // Mensagem para o novo grupo, caso houver erro de admin nos grupos antigos
                        conn.sendMessage(group.id, { text: `_Due to *[bot]* is no longer an admin in the old group, the game continues here!_` })

                    }
                    for (let i = 0; i < habitantesPlaneta.length; i++) {

                        let dataUser = global.db.data.users[habitantesPlaneta[i]].gameglx
                        if (dataUser.perfil.casa.idpelonome === db.planetas[planetas[i]].idpelonome) {
                            //Altera o id do planeta de cada jogador cadastrado naquele Grupo(Planeta)
                            dataUser.perfil.casa.id = group.id
                        }
                    }

                }
            }

            async function verificacaoAdmin(idgrupo) {
                // Faz verificação em um grupo pelo ID se o bot é administrador
                let result = await checkAdmin(idgrupo)
                let resultado
                async function checkAdmin(idd) {
                    const groupMetadata = ((conn.chats[idd] || {}).metadata || await this.groupMetadata(idd).catch((_) => null))
                    for (let i = 0; i < groupMetadata.participants.length; i++) {
                        if (groupMetadata.participants[i].id === conn.user.jid) {
                            return groupMetadata.participants[i].admin
                        }
                    }
                }
                if (result === 'admin') {
                    resultado = true
                } else if (result === 'superadmin') {
                    resultado = true
                } else if (result === null) {
                    resultado = false
                }
                return resultado
            }
        }

        async function cadastrarPosicaoNoMapa(maxX, minX, maxY, minY, planeta, colonia) {
            /** Para usar essa função você precisa passar todos os dados corretos que pedem */

            // Corpo do Object que vai para a lista de posição no db da colonia
            let dados = {
                id: data.perfil.id,
                x: 0,
                y: 0
            }
            let ax = await fNumeroAleatorio(maxX, minX) // sorteando Numero x
            let ay = await fNumeroAleatorio(maxY, minY) // sorteando Numero y

            console.log(ax, ay)
            // Verficando se a posição sorteada esta disponivel ou ja tem alguem usando
            let verificaposicao = await verificarPosicaoDb(ax, ay, planeta, colonia)
            console.log(verificaposicao)
            if (verificaposicao[0] === false || verificaposicao[0] === undefined || verificaposicao[0] === null) {
                console.log('usuario registrado')
                // Colocando a posição do usuario como utilizadas
                dados.x = ax
                dados.y = ay
                db.planetas[planeta].colonias[colonia].posicaoOcupadas.push(dados) // Cadastra a posição do usuario, dentro da colonia

                fs.writeFileSync('./src/assets/glx/db/database.json', JSON.stringify(db)) // Cdastrar a posicão do usuario, no planeta que esta.

                // Definindo a posição do usuario na colonia.
                data.perfil.localizacao.posicao.x = ax
                data.perfil.localizacao.posicao.y = ay
                data.perfil.casa.colonia.posicao.x = ax
                data.perfil.casa.colonia.posicao.y = ay


            }


        }



        async function fNumeroAleatorio(max, min) {
            const numeroAleatorio = Math.floor(Math.random() * (max - min + 1)) + min;
            return numeroAleatorio
        }

        async function verificarPosicaoDb(xx, yy, planeta, colonia) {
            let result
            let isCadastrado = false
            for (let i = 0; i < db.planetas[planeta].colonias[colonia].posicaoOcupadas.length; i++) {
                let x = false
                let y = false

                if (db.planetas[planeta].colonias[colonia].posicaoOcupadas[i].x === xx) {
                    x = true
                    if (db.planetas[planeta].colonias[colonia].posicaoOcupadas[i].y === yy) {
                        y = true
                    }
                }

                if (x === false && y === false) {
                    // Se x e y for diferente da posição sorteado, ele restorna que pode cadastrar
                    result = false
                }

                if (data.perfil.id === db.planetas[planeta].colonias[colonia].posicaoOcupadas[i].id) {
                    isCadastrado = true
                }
            }
            return [result, isCadastrado]
        }

        async function atacar(alvo) {
            let isNull
            let date = new Date()

            let isUsername = false  // Variavel usada para definir se o usuario esta cadastrado ou não

            for (let i = 0; i < db.user_cadastrado.username.length; i++) {
                if (alvo === data.perfil.username) return m.reply(`🤯 _No te puedes atacar a tí mismo!_`)

                if (data.perfil.ataque.data.contagem === 4 && (data.perfil.ataque.data.hora === date.getHours() || data.perfil.ataque.data.hora === date.getHours() + 1)) {

                    return m.reply(`_📛 Acabaste tu límite ${data.perfil.ataque.data.contagem} ataques!_\n*Espera 2 horas para volver a atacar.*`)
                } else {
                    if (data.perfil.ataque.data.hora != date.getHours()) {
                        data.perfil.ataque.data.contagem = 0
                        data.perfil.ataque.data.hora = 0
                    }
                }

                // Cancelar ataque se o username foi igual do atacante 


                // Se o username, estiver na lista de jogadores cadastrado, entra na definições de ataque
                if (db.user_cadastrado.username[i].username === alvo) {
                    // Adiciona uma contagem de ataque ao cronometro de ataque do usuario

                    let db1 = global.db.data.users[db.user_cadastrado.username[i].id].gameglx // Dados do usuario sendo atacado
                    let number = db.user_cadastrado.username[i].id.replace(/\D/g, '') // Pegar o Numero do atacado
                    let number2 = data.perfil.id.replace(/\D/g, '')
                    isUsername = true //  se o Usuario esta tem username cadastrado, retorna true

                    // DEFESA: Antes de qualquer outra coisa a defesa entra em ação
                    if (db1.perfil.defesa.forca >= data.perfil.ataque.forcaAtaque.ataque) {
                        data.perfil.ataque.data.contagem += 1
                        if (data.perfil.ataque.data.hora === 0) { data.perfil.ataque.data.hora = date.getHours() }

                        conn.sendMessage(db1.perfil.id, { text: `_Prepare your defense 🛡️, en 10 segundos, serás attacked by *@${number2}!*_`, mentions: [data.perfil.id] })
                        m.reply(`_⚔️ Your attack is in progress_ \n\n*_🏰 Careful! Your enemy is Vigilant_*`)

                        setTimeout(() => {
                            // DANOS AO ATACADO
                            // Defini o tanto de dano que que ira ser dado no inimigo... 
                            db1.perfil.defesa.forca = data.perfil.defesa.forca - data.perfil.ataque.forcaAtaque.ataque

                            // DANOS AO ATACANTE
                            if (data.perfil.defesa.forca >= db1.perfil.ataque.forcaAtaque.ataque) {
                                // Quando o atacante, faz seu ataque, ele tambem leva dano e aqui a gente faz o desconto do poder
                                data.perfil.defesa.forca = data.perfil.defesa.forca - db1.perfil.defesa.ataque
                            }
                            let stra = `
*🛡️Your defense lost: ${db1.perfil.defesa.ataque} Puntos*\n\n *_Watch out for your Home!_*                            
`

                            // Mensagem quando a defesa ainda esta defendendo
                            let str = `_*🛡️ The defense of @${number}, blocked your attack!*_

_The defense of ese astronauta, es fuerte, ha conseguido lo imposible. Cuidado._

👥 Damage to *you*:
  Perdiste: ${db1.perfil.ataque.forcaAtaque.ataque} Puntos
_________________________
😈 Damage to *@${number}*:
Perdió: ${db1.perfil.defesa.ataque} Puntos


  *💡 Tip:* _If your defense is losing many points, buy more weapons *(glx comprar)* or mine more minerals *(glx miner)* to increase your strength ._

                        `

                            conn.sendMessage(db1.perfil.id, { text: stra })
                            conn.sendMessage(id, { text: str, mentions: [db.user_cadastrado.username[i].id, db.user_cadastrado.username[i].id] })
                        }, 5000)
                        break;
                    }




                    // Quando a defesa não aguenta o ataque, esta mensage que sera definido.
                    let str = `⚠️ *Attention @${number} !*\n\n_You are being🔫 attacked by:_ \n\n*Nombre:* ${data.perfil.nome}\n*Username:* *${data.perfil.username}*`
                    let xpAleatorio = await fNumeroAleatorio(40, 15) // Gera um numero aleatorio para o XP de bonus
                    conn.sendMessage(db.user_cadastrado.username[i].id, { text: str, mentions: [db.user_cadastrado.username[i].id] })


                    setTimeout(() => {
                        data.perfil.ataque.data.contagem += 1 // Adiciona uma contagem de ataque ao cronometro de ataque do usuario
                        if (data.perfil.ataque.data.hora === 0) { data.perfil.ataque.data.hora = date.getHours() }

                        // INIMIGO: Diminui o poder do inimigo coforme a força de ataque
                        db1.perfil.poder = db1.perfil.poder - data.perfil.ataque.forcaAtaque.ataque
                        let valorDeDesconto = ((2 * db1.perfil.carteira.saldo) / 100)
                        let subTotal = db1.perfil.carteira.saldo - valorDeDesconto
                        db1.perfil.carteira.saldo = subTotal

                        // ATACANTE
                        data.perfil.xp += xpAleatorio // Por atacar e vencer o atacante ganhar xp
                        data.perfil.carteira.saldo += valorDeDesconto

                        // Mensagem que sera enviada, para quem fez o ataque, informando o que aconteceu na batalha
                        conn.sendMessage(id, {
                            text: `> 🗡️ Ataque finalizado!
                        
😈 *@${number}* perdió ${data.perfil.ataque.forcaAtaque.ataque} Punttos

Tu ganaste: 
*🆙XP:* ${xpAleatorio}xp | *Total XP:* ${data.perfil.xp}xp
*💸Money:* ${valorFormatado(valorDeDesconto)}


`, mentions: [db.user_cadastrado.username[i].id]
                        })

                        // Envia uma mensagem avisando quem sofreu o ataque de suas perdas.
                        conn.sendMessage(db.user_cadastrado.username[i].id, { text: `@${number} que triste! 😭\n\n*⚔️ Your defense failed ⚔️* \n\n> _There is damage to your facilities._`, mentions: [db.user_cadastrado.username[i].id] })
                    }, 10000)


                    // Envia uma mensagem informando que que logo o usuario sera atacado.
                    m.reply(`> 🔫 Viajando hasta *${alvo}*`)

                    // Se o atacante enviar uma mensagem em um grupo! o bot avisa quem sera atacado no grupo tambem
                    if (m.isGroup) {
                        conn.sendMessage(id, { text: str, mentions: [db.user_cadastrado.username[i].id] })
                    }

                }
            }
            if (isUsername === false || alvo === null || alvo === undefined) {
                if (alvo === undefined || alvo === null) {
                    m.reply(`_💡 You need to use the *UserName* del jugador que vas a atacar!_ \n*Ex: ${usedPrefix}glx atacar userEjemplo* \n\n*consejo:* Use *${usedPrefix}glx atacar list* - _To list users_\n\n`)
                } else {
                    //Envia uma mensagem se o username não existir na lista de cadastrados no game
                    m.reply(`*${alvo}* _There are no records with that user!_\n\n _💡 necesitas informar el *UserName* del jugador que atacará!_ \n*Ex: ${usedPrefix}glx atacar userEjemplo* \n\n*Tip:* Use *${usedPrefix}glx atacar list* - _To list the users_\n\n`)
                }

            }
        }


        // --------------------------- FIM DAS FUNÇÕES --------------------------------------------------------------------
        //-----------------------------------------------------------------------------------------------------------------




    } catch (err) {
        console.log(err)
    }
    async function createDataBase() {
        // Função para criar o arquivo database.json pela primeira vez

        const databasePath = `./src/assets/glx/db/database.json`;

        try {
            // Tenta ler o arquivo, se o arquivo existir! não faz nada
            fs.readFileSync(databasePath, 'utf8');
            // Se a leitura foi bem-sucedida, o arquivo já existe

        } catch (error) {
            if (error.code === 'ENOENT') {
                // Se o arquivo não existe, cria-o com a estrutura predefinida
                const databaseStructure = JSON.parse(fs.readFileSync('./src/assets/glx/db/template.json'))
                fs.writeFileSync(databasePath, JSON.stringify(databaseStructure, null, 2));
                console.log('database.json file created successfully.');
            } else {
                // Se ocorrer outro erro, imprime-o
                console.error('Error when trying to access the file database.json: de GAME GLX', error);
            }
        }



    }

    async function notificacao() {
        let db1 = JSON.parse(fs.readFileSync(`./src/assets/glx/db/database.json`))
        let data1 = global.db.data.users[m.sender].gameglx
        let api = await database_galaxia()

        if (db1.notificacao.status === true) {
            // Notificando os Grupos 
            conn.sendMessage(db1.planetas.terra.id, { text: db1.notificacao.msg[0] })
            conn.sendMessage(db1.planetas.megatron.id, { text: db1.notificacao.msg[0] })
            db1.notificacao.status = false

            fs.writeFileSync(`./src/assets/glx/db/database.json`, JSON.stringify(db1))
        }

        // Notificação automatica para cada usuario Jogador do Game GLX
        if (!data1.notificacao.recebidas.includes(api.notificacao.id)) {
            let number = data1.perfil.id.replace(/\D/g, '')
            let str = `*🔔 - Game Notification*\n\n*[BOT]* _The Mystic Bot MD_ \n*_Para:_ @${number}*\n\n`

            let msg = api.notificacao.msg // Mensagem de notificação na API 

            // Lendo as mensagens no repositorio API 
            for (let i = 0; i < msg.length; i++) {
                str += api.notificacao.msg[i]
            }
            str += `\n\n_For questions use the command,_ *glx criador!*\n`

            // Enviar Notificação para o usuario
            conn.sendMessage(data1.perfil.id, { text: str, mentions: [data1.perfil.id] })

            // Configuração de mensagem ja vista para este usuario
            data1.notificacao.recebidas.push(api.notificacao.id)
            fs.writeFileSync(`./database.json`, JSON.stringify(data1))

        }
    }

    async function database_galaxia() {
        try {
            let url = "https://raw.githubusercontent.com/jeffersonalionco/database-galaxia/master/database.json"
            const response = await fetch(url); // Faz uma solicitação HTTP para a URL fornecida
            if (!response.ok) { // Verifica se a resposta da solicitação foi bem-sucedida
                throw new Error('Error getting the data: ' + response.statusText);
            }
            const data = await response.json(); // Converte a resposta em JSON

            return data; // Retorna os dados JSON
        } catch (error) {
            console.error('An error occurred while getting the JSON data:', error);
            return null; // Retorna null em caso de erro
        }
    }

    // Função para Atualizar O repositorio
    async function atualizarRepositorio() {
        let database = await database_galaxia()
        let db1 = JSON.parse(fs.readFileSync(`./src/assets/glx/db/database.json`))


        if (!db1.repositorio.atualizado.includes(database.repositorio.atualizar)) {
            // Caminho para o diretório do seu repositório local
            fs.writeFileSync('./src/tmp/file', '')
            const repoPath = '.';

            // Instanciar o objeto simple-git com o caminho do seu repositório
            const git = simpleGit(repoPath);

            commitChanges() // Salvar os commits Locais
            async function commitChanges() {
                try {
                    await git.add('.');
                    await git.commit('Commit of local changes');
                    console.log('Local change saved successfully.');
                } catch (err) {
                    console.error('An error occurred while making local changes.:', err);
                }
            }

            // Atualizar o repositório
            setTimeout(() => {
                git.pull((err, update) => {
                    if (err) {
                        console.error('An error occurred while updating the repository.:', err);
                    } else {
                        if (update && update.summary.changes) {
                            console.log('Repository updated successfully!');
                            console.log('Summary of changes:', update.summary);
                        } else {
                            console.log('The repository is already up to date..');
                        }
                    }
                });
            }, 2000)

            // Salvando o id da atualização como ja executado.
            db1.repositorio.atualizado.push(database.repositorio.atualizar)
            fs.writeFileSync(`./src/assets/glx/db/database.json`, JSON.stringify(db1))

        }
    }
};
handler.command = /^(gameglx|glx)$/i;
export default handler;