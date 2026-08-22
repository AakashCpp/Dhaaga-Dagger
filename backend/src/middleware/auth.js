import { getFirebaseAuth } from "../config/firebase.js";
import { User } from "../models/User.js";
import { verifyAdminToken } from "../services/admin-token.service.js";

function bearerToken(request) {
  const [scheme, token] = (request.headers.authorization || "").split(" ");
  return scheme === "Bearer" && token ? token : null;
}

export async function requireCustomer(request, response, next) {
  const token = bearerToken(request);
  if (!token) return response.status(401).json({ error: { message: "Customer authentication required" } });
  try {
    const decoded = await getFirebaseAuth().verifyIdToken(token, true);
    if (!decoded.email || !decoded.email_verified) return response.status(403).json({ error: { message: "A verified email account is required" } });
    const user = await User.findOneAndUpdate(
      { firebaseUid: decoded.uid },
      {
        email: decoded.email,
        displayName: decoded.name || decoded.email.split("@")[0],
        photoURL: decoded.picture || "",
        emailVerified: Boolean(decoded.email_verified),
        lastLoginAt: new Date(),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ).lean();
    request.customer = { firebase: decoded, user };
    next();
  } catch (error) {
    if (error.status === 503) return next(error);
    return response.status(401).json({ error: { message: "Invalid or expired customer session" } });
  }
}

export function requireAdmin(request, response, next) {
  const token = bearerToken(request);
  if (!token) return response.status(401).json({ error: { message: "Admin authentication required" } });
  try {
    const session = verifyAdminToken(token);
    if (session.role !== "admin") throw new Error("Invalid role");
    request.admin = session;
    next();
  } catch {
    return response.status(401).json({ error: { message: "Invalid or expired admin session" } });
  }
}
