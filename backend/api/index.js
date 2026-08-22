import { app } from "../src/app.js";
import { connectDatabase } from "../src/config/database.js";

export default async function handler(request, response) {
  try {
    await connectDatabase();
    return app(request, response);
  } catch (error) {
    return response.status(503).json({ error: { message: "Database connection unavailable", details: error.message } });
  }
}

