import { Router } from "express";
import { getCustomerState, replaceCart, updateCheckout, updateProfile, updateWishlist } from "../controllers/customer.controller.js";
import { requireCustomer } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { cartSchema, checkoutSchema, profileSchema, wishlistSchema } from "../validation/schemas.js";

export const customerRouter = Router();
customerRouter.use(requireCustomer);
customerRouter.get("/me", getCustomerState);
customerRouter.patch("/me/profile", validate(profileSchema), updateProfile);
customerRouter.put("/me/cart", validate(cartSchema), replaceCart);
customerRouter.put("/me/wishlist", validate(wishlistSchema), updateWishlist);
customerRouter.put("/me/checkout", validate(checkoutSchema), updateCheckout);

