import { getFirebaseAuth } from "../config/firebase.js";
import { User } from "../models/User.js";
import { verifyAdminToken } from "../services/admin-token.service.js";
import { verifyOrderVerificationToken } from "../services/order-verification-token.service.js";

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

export function requireOrderVerification(request, response, next) {
  const token = request.get("X-Order-Verification");
  if (!token) return response.status(403).json({ error: { message: "Verify your email code before placing the order" } });
  try {
    const verification = verifyOrderVerificationToken(token);
    if (verification.purpose !== "order-email-verification"
      || verification.sub !== request.customer.firebase.uid
      || verification.email !== request.customer.firebase.email.toLowerCase()) throw new Error("Verification does not match customer");
    request.orderVerification = verification;
    next();
  } catch {
    return response.status(403).json({ error: { message: "Order email verification has expired. Request a new code." } });
  }
}
