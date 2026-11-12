const fs = require("fs");
const path = require("path");

const pluginDir = path.join(__dirname, "..", "private-plugins", "plugins");
const plugins = [];

if (fs.existsSync(pluginDir)) {
  for (const file of fs.readdirSync(pluginDir).filter((name) => name.endsWith(".js"))) {
    try {
      const plugin = require(path.join(pluginDir, file));
      if (typeof plugin === "function") plugins.push(plugin);
    } catch (error) {
      console.error("[private-plugin] Could not load", file, error.message);
    }
  }
}

async function runPrivatePlugins(ctx) {
  for (const plugin of plugins) {
    try {
      if (await plugin(ctx)) return true;
    } catch (error) {
      console.error("[private-plugin] Execution error:", error);
    }
  }
  return false;
}

module.exports = { runPrivatePlugins };
