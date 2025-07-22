import express from "express";
import cors from "cors";
import "dotenv/config";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import aiRouter from "./routes/aiRoute.js";
import connectCloudinary from "./configs/cloudinary.js";
import userRouter from "./routes/userRoute.js";


// Verify environment variables are loaded


if (!process.env.CLERK_PUBLISHABLE_KEY || !process.env.CLERK_SECRET_KEY) {
  console.error(
    "Missing Clerk environment variables. Please check your .env file."
  );
  process.exit(1);
}

const app = express();

await connectCloudinary();

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

app.get("/", (req, res) => {
  res.send("Server is live!");
});

// Mount AI router BEFORE authentication
app.use("/api/ai", aiRouter);
app.use("/api/user", userRouter);

// Apply authentication to all other routes
app.use(requireAuth());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
