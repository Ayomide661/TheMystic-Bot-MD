<p align="center">
  <h1 align="center">TheMystic-Bot-MD</h1>
  <p align="center">An automated WhatsApp bot built on Node.js with English language support</p>
</p>

<p align="center">
  <a href="https://github.com/Ayomide661">
    <img alt="GitHub Stars" src="https://img.shields.io/github/stars/Ayomide661/TheMystic-Bot-MD?style=for-the-badge" />
  </a>
  <a href="https://github.com/Ayomide661">
    <img alt="GitHub Forks" src="https://img.shields.io/github/forks/Ayomide661/TheMystic-Bot-MD?style=for-the-badge" />
  </a>
</p>

## About

This is my personal WhatsApp bot project. Forked and customized by **Ayomide661**.

The bot supports:
- **English** as default language
- Group management (kick, ban, promote, demote, tags)
- Downloader (YouTube, TikTok, Instagram, Facebook, etc.)
- Games (slots, quiz, tictactoe, guess songs, etc.)
- AI chat (ChatGPT integration)
- Sticker tools (create, convert, QR codes)
- Moderation (anti-link, anti-spam, anti-toxic)
- Media converters (audio, video, images)
- And more!

## Deployment

### Method 1: Local Deployment (Recommended)

**Step 1: Install prerequisites**
```bash
# Install Node.js (v18 or higher)
# On Ubuntu/Debian:
sudo apt update && sudo apt install nodejs npm git -y

# On Windows: Download from https://nodejs.org
# On Mac: brew install node
```

**Step 2: Clone the repository**
```bash
git clone https://github.com/Ayomide661/TheMystic-Bot-MD.git
cd TheMystic-Bot-MD
```

**Step 3: Install dependencies**
```bash
npm install
```

**Step 4: Start the bot**
```bash
npm start
```

**Step 5: Link your WhatsApp**
- Select option 2 (8-digit text code)
- Enter the code on your phone: WhatsApp > Linked Devices > Link with phone number
- Or scan the QR code if you select option 1

### Method 2: CLI Deployment (Termux/Linux)

**Step 1: Install Termux (Android)**
- Download from F-Droid or GitHub: https://github.com/termux/termux-app

**Step 2: Update packages**
```bash
pkg update && pkg upgrade
pkg install nodejs git ffmpeg -y
```

**Step 3: Clone and install**
```bash
git clone https://github.com/Ayomide661/TheMystic-Bot-MD.git
cd TheMystic-Bot-MD
npm install
```

**Step 4: Run the bot**
```bash
npm start
```

### Method 3: Linux Server (VPS)

**Step 1: Connect to your VPS**
```bash
ssh user@your-server-ip
```

**Step 2: Install Node.js**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs git ffmpeg -y
```

**Step 3: Clone and install**
```bash
git clone https://github.com/Ayomide661/TheMystic-Bot-MD.git
cd TheMystic-Bot-MD
npm install
```

**Step 4: Run in background**
```bash
# Using nohup:
nohup npm start &

# Or using screen:
screen -S bot
npm start
# Press Ctrl+A, then D to detach
```

**Step 5: Keep it running (optional)**
```bash
# Install pm2 for process management:
npm install -g pm2
pm2 start npm --name "mystic-bot" -- start
pm2 save
pm2 startup
```

## Configuration

Edit `config.js` to customize:
- Bot name and prefix
- Owner number
- Premium users
- API keys (ChatGPT, etc.)

## Commands

| Category | Commands |
|----------|----------|
| **Group** | kick, ban, promote, demote, tagall, warn, mute |
| **Download** | play, ytmp3, ytmp4, tiktok, instagram, facebook |
| **Games** | slot, tictactoe, guess, quiz, akinator |
| **AI** | chatgpt, ai, ask |
| **Stickers** | sticker, qrcode, take, emojimix |
| **Tools** | weather, translate, ocr, calc |
| **Owner** | restart, update, broadcast, eval |

## Support

For issues or questions, open an issue on GitHub.

## Credits

Based on the original TheMystic-Bot-MD project. Customized and maintained by **Ayomide661**.
