import express from "express";
import { auth } from "../middlewares/auth.js";
import {
  getUserCreations,
  toggleLikeCreation,
  getPublicCreations,
  getMostLikedCreations,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/get-user-creations", auth, getUserCreations);
userRouter.get("/get-publish-creations", auth, getPublicCreations);
userRouter.post("/toggle-like-creations", auth, toggleLikeCreation);
userRouter.get("/get-most-liked-creations", auth, getMostLikedCreations);

export default userRouter;
