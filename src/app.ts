import express from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route";
import courseRoutes from "./routes/course.route";
import enrollementRoutes from "./routes/enrollement.route";
import jobRoutes from "./routes/job.route";
import StudyLevelRoutes from "./routes/studyLevel.route";
import categoryRoutes from "./routes/category.route";
import paymentsRoute from "./routes/payment.route";

const app = express();

// Middleware
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Routes
app.use("/api", authRoutes);

// routes course
app.use("/api", courseRoutes);
// Routes pour inscription
app.use("/api", enrollementRoutes);
// routes job
app.use("/api", jobRoutes);
// Routes pour StudyLevel
app.use("/api", StudyLevelRoutes);
// routes category
app.use("/api", categoryRoutes);
// routes payment
app.use("/api", paymentsRoute);

// Here use the app.use to use the routes

export default app;
