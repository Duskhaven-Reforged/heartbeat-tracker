import {
  Client,
  GatewayIntentBits,
  Message,
  TextChannel,
  EmbedBuilder,
} from "discord.js";
import { GameStatus } from "../types/GameStatus";

export class DiscordClient {
  public client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  });
  public isLoggedIn = false;
  private channelID: string;

  constructor(clientToken: string, channelID: string) {
    this.client.login(clientToken);
    this.channelID = channelID;

    this.client.on("ready", async () => {
      console.log("💻 Logged in");
      this.isLoggedIn = true;
    });
  }

  public async updateChannel(gameStatus: GameStatus) {
    const channelCache = this.client.channels.cache.get(this.channelID);
    if (!channelCache) {
      console.log("Could not find channel");
      return;
    }
    const channel = (await channelCache.fetch()) as TextChannel;
    const embed = new EmbedBuilder()
      .setColor(
        gameStatus.worldServer && gameStatus.authServer ? 5763719 : 15548997
      )
      .setAuthor({
        name: "Duskhaven Reforged",
        iconURL: "https://api.duskhaven.net/news/uploads/logo_f7154459f1.png",
        url: "https://duskhaven.net",
      })
      .setTitle("Server Status")
      .addFields(
        {
          name: "World Server",
          value: gameStatus.worldServer ? "Online" : "Offline",
          inline: true,
        },
        {
          name: "\u200b",
          value: "\u200b",
          inline: true,
        },
        {
          name: "Auth Server",
          value: gameStatus.authServer ? "Online" : "Offline",
        }
      );
    await channel.send({
      embeds: [embed],
    });
  }
}
