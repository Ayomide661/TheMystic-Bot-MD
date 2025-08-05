import fetch from 'node-fetch';
import PDFDocument from 'pdfkit';
import {extractImageThumb} from "baileys";

const handler = async (m, {conn, text, usedPrefix, command, args}) => {
  const datas = global;
  const idioma = datas.db.data.users[m.sender].language || global.defaultLenguaje; // User's language preference
  const _translate = JSON.parse(fs.readFileSync(`./src/languages/${idioma}.json`)); // Load translations
  const tradutor = _translate.plugins.adult_hentaipdf; // Get NSFW PDF translations

  // Check if NSFW mode is enabled in groups
  if (!db.data.chats[m.chat].modohorny && m.isGroup) throw tradutor.texto1;
  
  // Validate search query exists
  if (!text) throw `${tradutor.texto2} ${usedPrefix + command} ${tradutor.texto2_1}`;
  
  try {
    m.reply(global.wait); // Send "wait" message
    
    // Search for hentai content
    const res = await fetch(`https://api.lolhuman.xyz/api/nhentaisearch?apikey=${lolkeysapi}&query=${text}`);
    const json = await res.json();
    const aa = json.result[0].id; // Get first result ID
    
    // Scrape detailed hentai data
    const data = await nhentaiScraper(aa);
    const pages = [];
    
    // Get thumbnail image
    const thumb = `https://external-content.duckduckgo.com/iu/?u=https://t.nhentai.net/galleries/${data.media_id}/thumb.jpg`;
    
    // Compile all page images
    data.images.pages.map((v, i) => {
      const ext = new URL(v.t).pathname.split('.')[1];
      pages.push(`https://external-content.duckduckgo.com/iu/?u=https://i7.nhentai.net/galleries/${data.media_id}/${i + 1}.${ext}`);
    });
    
    // Prepare thumbnail
    const buffer = await (await fetch(thumb)).buffer();
    const jpegThumbnail = await extractImageThumb(buffer);
    
    // Convert images to PDF
    const imagepdf = await toPDF(pages);
    
    // Send PDF with metadata
    await conn.sendMessage(m.chat, {
      document: imagepdf, 
      jpegThumbnail, 
      fileName: data.title.english + '.pdf', 
      mimetype: 'application/pdf'
    }, {quoted: m});
    
  } catch {
    throw `${tradutor.texto3}`; // Error message
  }
};

// Command configuration
handler.tags = ['nsfw'];
handler.help = ['hentaipdf'];
handler.command = /^(hentaipdf)$/i;
export default handler;

/**
 * NHentai scraper function
 * @param {string} id - Hentai ID to scrape
 */
async function nhentaiScraper(id) {
  const uri = id ? `https://cin.guru/v/${+id}/` : 'https://cin.guru/';
  const html = (await axios.get(uri)).data;
  return JSON.parse(html.split('<script id="__NEXT_DATA__" type="application/json">')[1].split('</script>')[0]).props.pageProps.data;
}

/**
 * Converts images to PDF
 * @param {Array} images - Array of image URLs
 * @param {Object} opt - Additional options
 */
function toPDF(images, opt = {}) {
  return new Promise(async (resolve, reject) => {
    if (!Array.isArray(images)) images = [images];
    const buffs = [];
    const doc = new PDFDocument({margin: 0, size: 'A4'});
    
    for (let x = 0; x < images.length; x++) {
      if (/.webp|.gif/.test(images[x])) continue;
      
      const data = (await axios.get(images[x], {responseType: 'arraybuffer', ...opt})).data;
      doc.image(data, 0, 0, {
        fit: [595.28, 841.89], // A4 dimensions in points
        align: 'center', 
        valign: 'center'
      });
      
      if (images.length != x + 1) doc.addPage();
    }
    
    doc.on('data', (chunk) => buffs.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(buffs)));
    doc.on('error', (err) => reject(err));
    doc.end();
  });
}