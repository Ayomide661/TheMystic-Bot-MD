import { watchFile, unwatchFile } from 'fs';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import fs from 'fs'; 
import moment from 'moment-timezone';

// Load environment variables if using dotenv (optional)
// import 'dotenv/config';

global.botnumber = "";
global.confirmCode = "";
global.authFile = `MysticSession`;
global.isBaileysFail = false;
global.defaultLenguaje = 'en';

// Auto-detect owner(s) from environment variable or default
const OWNER_NUMBERS = process.env.OWNER_NUMBERS?.split(',') || ['2348108629978'];
const SUIT_TAG_NUMBERS = process.env.SUIT_TAG_NUMBERS?.split(',') || OWNER_NUMBERS;
const PREMIUM_NUMBERS = process.env.PREMIUM_NUMBERS?.split(',') || OWNER_NUMBERS;
const MODS_NUMBERS = process.env.MODS_NUMBERS?.split(',') || OWNER_NUMBERS;

// Set global variables
global.owner = OWNER_NUMBERS.map(number => [number.trim()]);
global.suittag = SUIT_TAG_NUMBERS.map(number => number.trim());
global.prems = PREMIUM_NUMBERS.map(number => number.trim());
global.mods = MODS_NUMBERS.map(number => number.trim());

// Rest of your configuration remains the same
global.BASE_API_DELIRIUS = "https://delirius-apiofc.vercel.app";
global.packname = '· • • ━✦︵‿୨❄️୧‿︵✦ ━ • • ·';
global.author = 'Ayphish';
global.wm = 'The Mystic - Bot';
global.titulowm = 'Mystic Bot';
global.titulowm2 = `Mystic Bot`;
global.igfg = 'The Mystic';
global.wait = '*_[ ⏳ ] Loading..._*';

global.imagen1 = fs.readFileSync('./src/assets/images/menu/languages/es/menu.png');
global.imagen2 = fs.readFileSync('./src/assets/images/menu/languages/pt/menu.png');
global.imagen3 = fs.readFileSync('./src/assets/images/menu/languages/fr/menu.png');
global.imagen4 = fs.readFileSync('./src/assets/images/menu/languages/en/menu.png');
global.imagen5 = fs.readFileSync('./src/assets/images/menu/languages/ru/menu.png');

// Time configuration
global.d = new Date(new Date + 3600000);
global.locale = 'en';
global.dia = d.toLocaleDateString(locale, { weekday: 'long' });
global.fecha = d.toLocaleDateString('es', { day: 'numeric', month: 'numeric', year: 'numeric' });
global.mes = d.toLocaleDateString('es', { month: 'long' });
global.año = d.toLocaleDateString('es', { year: 'numeric' });
global.tiempo = d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });

global.wm2 = `${dia} ${fecha}\nThe Mystic - Bot`;
global.gt = 'The Mystic - Bot';
global.mysticbot = 'The Mystic - Bot';
global.channel = 'https://whatsapp.com/channel/0029Vaein6eInlqIsCXpDs3y';
global.md = 'https://github.com/Ayomide661/TheMystic-Bot-MD';
global.mysticbot = 'https://github.com/Ayomide661/TheMystic-Bot-MD';
global.waitt = '*_[ ⏳ ] Loading..._*';
global.waittt = '*_[ ⏳ ] Loading..._*';
global.waitttt = '*_[ ⏳ ] Loading..._*';
global.nomorown = OWNER_NUMBERS[0] || '2348108629978';
global.pdoc = [
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', 
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
  'application/pdf', 
  'application/zip'
];

// Menu styling
global.cmenut = '❖––––––『';
global.cmenub = '┊✦ ';
global.cmenuf = '╰━═┅═━––––––๑\n';
global.cmenua = '\n⌕ ❙❘❙❙❘❙❚❙❘❙❙❚❙❘❙❘❙❚❙❘❙❙❚❙❘❙❙❘❙❚❙❘ ⌕\n     ';
global.dmenut = '*❖─┅──┅〈*';
global.dmenub = '*┊»*';
global.dmenub2 = '*┊*';
global.dmenuf = '*╰┅────────┅✦*';
global.htjava = '⫹⫺';
global.htki = '*⭑•̩̩͙⊱•••• ☪*';
global.htka = '*☪ ••••̩̩͙⊰•⭑*';
global.comienzo = '• • ◕◕════';
global.fin = '════◕◕ • •';
global.botdate = `*[ 📅 ] Date:*  ${moment.tz('America/Mexico_City').format('DD/MM/YY')}`;
global.bottime = `*[ ⏳ ] Time:* ${moment.tz('America/Mexico_City').format('HH:mm:ss')}`;
global.fgif = { 
  key: { participant: '0@s.whatsapp.net' }, 
  message: { 
    'videoMessage': { 
      'title': wm, 
      'h': `Hmm`, 
      'seconds': '999999999', 
      'gifPlayback': 'true', 
      'caption': bottime, 
      'jpegThumbnail': fs.readFileSync('./src/assets/images/menu/languages/en/menu.png')
    }
  }
};
global.multiplier = 99;
global.flaaa = [
  'https://flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=water-logo&script=water-logo&fontsize=90&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&fillTextColor=%23000&sha...',
  'https://flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=crafts-logo&fontsize=90&doScale=true&scaleWidth=800&scaleHeight=500&text=',
  'https://flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=amped-logo&doScale=true&scaleWidth=800&scaleHeight=500&text=',
  'https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=sketch-name&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&fillTextType=1&fillTextPattern=Warning!&text=',
  'https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=sketch-name&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&fillTextType=1&fillTextPattern=Warning!&fillColo...'
];

const file = fileURLToPath(import.meta.url);
watchFile(file, () => {
  unwatchFile(file);
  console.log(chalk.redBright('Update \'config.js\''));
  import(`${file}?update=${Date.now()}`);
});