import * as net from "net";
import { GameSocket } from "./GameSocket";
import { GameStatus } from "../types/GameStatus";
import { DiscordClient } from "../Discord/Bot";

export class WoWSocket {
  public authSocket: GameSocket;
  public worldSocket: GameSocket;
  private gameStatus: GameStatus = {
    authServer: false,
    worldServer: false,
  };
  private firstMessageSent = false;
  public discord: DiscordClient;

  constructor(
    discordClient: DiscordClient,
    authPort: number,
    worldPort: number,
    host: string
  ) {
    this.discord = discordClient;
    this.authSocket = new GameSocket(authPort, host);
    this.worldSocket = new GameSocket(worldPort, host);
    this.setupHooks();
  }

  initialize() {
    this.authSocket.connect();
    this.worldSocket.connect();
  }

  setupHooks() {
    this.authSocket.on("status", (status) => {
      if (this.gameStatus.authServer !== status) {
        this.gameStatus.authServer = status;
        this.discord.updateChannel(this.gameStatus);
        this.firstMessageSent = true;
      }

      if (!this.firstMessageSent) {
        this.discord.updateChannel(this.gameStatus);
        this.firstMessageSent = true;
      }
    });

    this.worldSocket.on("status", (status) => {
      if (this.gameStatus.worldServer !== status) {
        this.gameStatus.worldServer = status;
        this.discord.updateChannel(this.gameStatus);
        this.firstMessageSent = true;
      }

      if (!this.firstMessageSent) {
        this.discord.updateChannel(this.gameStatus);
        this.firstMessageSent = true;
      }
    });
  }
}
