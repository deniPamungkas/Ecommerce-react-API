import { Router } from "express";
import {
  addCart,
  clearCart,
  getAllCart,
  removeFromCart,
} from "../controllers/cart.js";

const route = Router();

route.post("/addCart/:id", addCart);
route.get("/getAllCart", getAllCart);
route.post("/removeFromCart", removeFromCart);
route.get("/clearCart", clearCart);

export default route;
