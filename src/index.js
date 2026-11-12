const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys");
const pino = require("pino");
const qrcode = require("qrcode-terminal");
const path = require("path");
const { runPrivatePlugins } = require("./private-plugin-loader");

async function startBot() {
  const sessionDir = process.env.SESSION_DIR || path.join(__dirname, "..", "session");
  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: "silent" }),
    printQRInTerminal: false,
    browser: ["HANS TECHY V2", "Chrome", "1.0.0"]
  });

  sock.ev.on("creds.update", saveCreds);

  const pairingNumber = (process.env.PAIRING_NUMBER || "").replace(/\\D/g, "");
  if (!state.creds.registered && pairingNumber) {
    setTimeout(async () => {
      try {
        const code = await sock.requestPairingCode(pairingNumber);
        console.log("WHATSAPP PAIRING CODE:", code);
      } catch (error) {
        console.error("Pairing code request failed:", error?.message || error);
      }
    }, 3000);
  }
  sock.ev.on("connection.update", ({ connection, lastDisconnect, qr }) => {
    if (qr && !process.env.PAIRING_NUMBER) qrcode.generate(qr, { small: true });
    if (connection === "close") {
      const code = lastDisconnect?.error?.output?.statusCode;
      if (code !== DisconnectReason.loggedOut) startBot();
      else console.log("WhatsApp session logged out. Remove session and scan again.");
    }
    if (connection === "open") console.log("HANS TECHY V2 connected.");
  });

  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;
    for (const msg of messages) {
      if (!msg.message || msg.key.fromMe) continue;
      const from = msg.key.remoteJid;
      const body = msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        msg.message.imageMessage?.caption ||
        msg.message.videoMessage?.caption || "";
      if (!body.startsWith(".")) continue;
      const [command, ...args] = body.slice(1).trim().split(/\s+/);
      const text = args.join(" ");
      const reply = (value) => sock.sendMessage(from, { text: String(value) }, { quoted: msg });
      const ctx = { sock, msg, from, text, command: (command || "").toLowerCase(), args, reply };
      if (ctx.command === "menu") {
        await reply("HANS TECHY V2\n.menu — show menu\n.ping — test bot\n.private — private plugin demo");
        continue;
      }
      if (await runPrivatePlugins(ctx)) continue;
      if (ctx.command === "ping") await reply("Pong!");
    }
  });
}

startBot().catch((error) => {
  console.error("Bot startup failed:", error);
  process.exit(1);
});
