import { Router } from "express";
import { login, logout, signUp } from "../controllers/auth.js";

const route = Router();

route.post("/signUp", signUp);
route.post("/login", login);
route.get("/logout", logout);

export default route;
