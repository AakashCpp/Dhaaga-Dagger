import { Server } from "socket.io";
import { env } from "../config/env.js";
import { registerSocketServer } from "./hub.js";
import { verifyAdminToken } from "../services/admin-token.service.js";

export function attachRealtime(server) {
  const io = new Server(server, {
    cors: { origin: env.clientOrigins, credentials: true },
    transports: ["websocket", "polling"],
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      socket.data.role = "storefront";
      return next();
    }
    try {
      const session = verifyAdminToken(token);
      if (session.role !== "admin") throw new Error("Invalid role");
      socket.data.admin = session;
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    if (socket.data.admin) socket.join("admins");
    else socket.join("storefront");
    socket.emit("realtime:ready", { connectedAt: new Date().toISOString() });
  });

  registerSocketServer(io);
  return io;
}
