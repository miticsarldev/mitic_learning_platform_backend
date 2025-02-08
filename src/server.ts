import mongoose from "mongoose";
import { config } from "dotenv";
config();

import app from "./app";

const PORT = process.env.PORT || 4444;

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
