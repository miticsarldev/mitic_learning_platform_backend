import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import Job from "../models/Job"; // Vérifie le chemin
import { config } from "dotenv";
config();

// Connexion à MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("✅ Connecté à MongoDB");
  } catch (error) {
    console.error("❌ Erreur de connexion MongoDB:", error);
    process.exit(1);
  }
}

// Génération d'un job factice
const createFakeJob = () => {
  return new Job({
    name: faker.person.jobTitle(),
    description: faker.lorem.sentence(),
  });
};

// Insertion de plusieurs jobs
async function seedJobs(nbJobs = 10) {
  await connectDB();

  try {
    const jobs = Array.from({ length: nbJobs }, createFakeJob);
    await Job.insertMany(jobs);
    console.log(`✅ ${nbJobs} jobs insérés avec succès !`);
  } catch (error) {
    console.error("❌ Erreur lors de l'insertion des jobs:", error);
  } finally {
    mongoose.connection.close();
    console.log("🔌 Déconnecté de MongoDB");
  }
}

// Exécuter le script avec 10 jobs par défaut
seedJobs(10);
