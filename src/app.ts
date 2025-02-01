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
import lessonsRoutes from "./routes/lessons.route";
import sectionRoutes from "./routes/section.route";
import avisRoutes from "./routes/avis.route";
import progressRoutes from "./routes/progress.route";
import axios from "axios";
import { config } from "dotenv";
config();

const app = express();

// Middleware
const corsOptions = {
  origin: "http://localhost:3000",
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


const ORANGE_AUTH_URL = "https://api.orange.com/oauth/v3/token";
const ORANGE_PAYMENT_URL = "https://api.orange.com/orange-money-webpay/dev/v1/webpayment";

// Récupérer le token d'authentification Orange
const getOrangeAuthToken = async () => {
  try {
    const response = await axios.post(
      ORANGE_AUTH_URL,
      "grant_type=client_credentials",
      {
        headers: {
          "Authorization": `Basic ${Buffer.from(`${process.env.ORANGE_CLIENT_ID}:${process.env.ORANGE_CLIENT_SECRET}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded"
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error("Erreur d'authentification Orange Money :", error);
    throw error;
  }
};

// Route pour initier un paiement
app.post("/api/orange-money/pay", async (req, res) => {
  try {
    const { amount, phone, orderId } = req.body;
    const token = await getOrangeAuthToken();

    const response = await axios.post(
      ORANGE_PAYMENT_URL,
      {
        "merchant_key": process.env.ORANGE_MERCHANT_KEY,
        "currency": "XOF",
        "order_id": orderId,
        "amount": amount,
        "return_url": "http://localhost:3000/cours/cours_details/67780e77673938fa8299204a",
        "cancel_url": "http://localhost:3000/cours/cours_details/67780e77673938fa8299204a",
        "notif_url": "https://ton-site.com/notify",
        "lang": "fr"
      },
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Erreur de paiement Orange Money :", error);
    res.status(500).json({ error: "Échec du paiement" });
  }
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
//routes pour lessons
app.use("/api", lessonsRoutes);
//routes pour section
app.use("/api", sectionRoutes);
//routes pour avis
app.use("/api", avisRoutes);
// routes pour progress
app.use("/api", progressRoutes);

// Here use the app.use to use the routes

export default app;
