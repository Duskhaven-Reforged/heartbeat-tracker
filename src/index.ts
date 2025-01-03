import { DiscordClient } from "./Discord/Bot";
import { WoWSocket } from "./GameMonitor/socket";

const discordToken = process.env.DISCORD_TOKEN;
const discordChannel = process.env.DISCORD_CHANNEL;
const authPort = process.env.AUTH_PORT;
const worldPort = process.env.WORLD_PORT;
const host = process.env.HOST;

if (!discordToken || !discordChannel || !authPort || !worldPort || !host) {
  console.log("ENV variables unconfigured");
  process.exit(1);
}

const discord = new DiscordClient(discordToken, discordChannel);

discord.client.on("ready", () => {
  const wowSocket = new WoWSocket(
    discord,
    parseInt(authPort),
    parseInt(worldPort),
    host
  );
  wowSocket.initialize();
});
