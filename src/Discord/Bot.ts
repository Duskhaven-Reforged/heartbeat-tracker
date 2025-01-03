import {
  Client,
  GatewayIntentBits,
  Message,
  TextChannel,
  EmbedBuilder,
} from "discord.js";
import { GameStatus } from "../types/GameStatus";
import { EventEmitter } from "stream";

export class DiscordClient extends EventEmitter {
  public client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  });
  public isLoggedIn = false;
  private channelID: string;
  private message: undefined | Message;

  constructor(clientToken: string, channelID: string) {
    super();
    this.client.login(clientToken);
    this.channelID = channelID;

    this.client.on("ready", async () => {
      console.log("💻 Logged in");
      this.isLoggedIn = true;
      this.fetchExistingMessage();
    });
  }

  public async fetchExistingMessage() {
    const channelCache = this.client.channels.cache.get(
      process.env.DISCORD_CHANNEL!
    );
    if (!channelCache) {
      console.log("❌ Channel Not Found");
      return;
    }

    const channel = (await channelCache.fetch()) as TextChannel;
    const messages = await channel.messages.fetch();
    const botMessage = messages.find((msg) => msg.author.bot === true);

    if (!botMessage) {
      this.message = undefined;
      this.emit("foundMessage");
      return;
    }

    this.message = botMessage;
    this.emit("foundMessage");
  }

  public async updateChannel(gameStatus: GameStatus) {
    const channelCache = this.client.channels.cache.get(this.channelID);
    if (!channelCache) {
      console.log("Could not find channel");
      return;
    }
    const channel = (await channelCache.fetch()) as TextChannel;
    const embed = new EmbedBuilder()
      .setColor(gameStatus.worldServer ? 5763719 : 15548997)
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
        }
        // {
        //   name: "\u200b",
        //   value: "\u200b",
        //   inline: true,
        // },
        // {
        //   name: "Auth Server",
        //   value: gameStatus.authServer ? "Online" : "Offline",
        // }
      );
    if (!this.message) {
      this.message = await channel.send({
        embeds: [embed],
      });
      return;
    }

    this.message.edit({
      embeds: [embed],
    });
  }
}
