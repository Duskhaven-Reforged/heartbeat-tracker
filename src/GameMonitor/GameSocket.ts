import * as net from "net";
import { EventEmitter } from "stream";

export class GameSocket extends EventEmitter {
  public socket = new net.Socket();
  port: number;
  host: string;

  constructor(port: number, host: string) {
    super();

    this.port = port;
    this.host = host;
  }

  public async connect() {
    console.log(`Connecting to host ${this.host} port ${this.port}`);
    this.setupHooks();
    this.socket.connect(this.port, this.host);
  }

  public async sendHeartBeat() {}

  private setupHooks() {
    this.socket.on("connect", () => {
      this.emit("status", true);
    });

    this.socket.on("close", () => {
      this.emit("status", false);
      this.socket.removeAllListeners();
      this.socket.destroy();

      setTimeout(() => {
        this.connect();
      }, 5000);
    });

    this.socket.on("error", (error) => {
      console.log(error);
    });
  }
}
