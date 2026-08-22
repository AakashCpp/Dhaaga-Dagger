import { createServer } from "node:http";
import { app } from "./app.js";
import { connectDatabase } from "./config/database.js";
import { env } from "./config/env.js";
import { attachRealtime } from "./realtime/socket.js";
import { verifyAdminMailer } from "./services/mail.service.js";

const server = createServer(app);
attachRealtime(server);

connectDatabase()
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error(`MongoDB unavailable: ${error.message}`));

verifyAdminMailer()
  .then(({ mode, ready }) => console.log(`Admin OTP mailer: ${mode}${ready ? " ready" : " development only"}`))
  .catch((error) => console.error(`Admin OTP mailer unavailable: ${error.message}`));

server.listen(env.port, () => {
  console.log(`API listening on http://localhost:${env.port}`);
});

function shutdown(signal) {
  console.log(`${signal} received; closing server`);
  server.close(() => process.exit(0));
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
