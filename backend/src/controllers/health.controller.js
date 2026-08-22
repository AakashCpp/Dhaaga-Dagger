import { databaseStatus } from "../config/database.js";

export function healthCheck(_request, response) {
  response.json({
    status: "ok",
    service: "dhaaga-dagger-api",
    database: databaseStatus(),
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
}

export function readinessCheck(_request, response) {
  const database = databaseStatus();
  response.status(database === "connected" ? 200 : 503).json({
    status: database === "connected" ? "ready" : "not-ready",
    database,
    timestamp: new Date().toISOString(),
  });
}

