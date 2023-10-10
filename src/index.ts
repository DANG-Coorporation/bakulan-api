import dotenv from "dotenv";
import { Request, Response } from "express";
import http from "http";
import { AddressInfo } from "net";
import { BgWhite, FgMagenta, Reset } from "./config/color-terminal";
import expressServer from "./server";
dotenv.config();

// Normalize port number which will expose server
const port = normalizePort(process.env.PORT ?? 3000);

// Instantiate the expressServer class
let expressInstance = new expressServer().expressInstance;

// Make port available within server
expressInstance.set("port", port);

// Create the HTTP Express Server
const server = http.createServer(expressInstance);

// Start listening on the specified Port (Default: 3000)
server.listen(port);
server.on("error", (error: NodeJS.ErrnoException, res: Response) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  onError(error);
  res.status(500).send("Internal Server Error");
});
server.on("listening", onListening);
server.on("request", (req: Request, res) => {
  console.log(
    JSON.stringify({
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body,
    })
  );
});

// Port Normalization
function normalizePort(val: number | string): number | string | boolean {
  const port: number = typeof val === "string" ? parseInt(val, 10) : val;
  if (isNaN(port)) {
    return val;
  } else if (port >= 0) {
    return port;
  } else {
    return false;
  }
}

function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening(): void {
  const addr = <AddressInfo>server.address();
  const bind =
    typeof addr === "string"
      ? `pipe ${addr}`
      : `${FgMagenta}${BgWhite}Listetning on port ${addr.port} ${Reset}`;
  console.log(bind);
}
