# HANS TECHY V2

WhatsApp bot starter powered by Baileys. Private commands are loaded from the separate `hanstechy1/PLUGIN` repository during GitHub Actions.

## Setup
1. Use Node.js 20 or newer.
2. Run `npm install`.
3. Run `npm start` and scan the QR code from WhatsApp Linked Devices.
4. Keep the generated `session/` folder private and persistent.

## Private plugin integration
Add a GitHub Actions secret named `PLUGIN_REPO_TOKEN` to this public repository. It must be a fine-grained token with read-only Contents access to the private `PLUGIN` repository. Never commit the token.

Open Actions → Integrate private PLUGIN repository → Run workflow. A successful run creates the artifact `hans-techy-v2-with-private-plugins`.

## Important
The workflow packages the bot; it does not deploy it to a hosting provider. Configure WhatsApp session persistence and runtime secrets securely on your host. Do not commit real API keys or session files.
