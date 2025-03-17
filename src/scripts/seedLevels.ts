import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import StudyLevel from "../models/StudyLevel";
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

// Génération d'un niveau d'étude factice
const createFakeStudyLevel = () => {
  return new StudyLevel({
    name: faker.lorem.word(),
    description: faker.lorem.sentence(),
  });
};

// Insertion de plusieurs niveaux d'étude
async function seedStudyLevels(nbStudyLevels = 10) {
  await connectDB();

  try {
    const studyLevels = Array.from({ length: nbStudyLevels }, createFakeStudyLevel);
    await StudyLevel.insertMany(studyLevels);
    console.log(`✅ ${nbStudyLevels} niveaux d'étude insérés avec succès !`);
  } catch (error) {
    console.error("❌ Erreur lors de l'insertion des niveaux d'étude:", error);
  } finally {
    mongoose.connection.close();
    console.log("🔌 Déconnecté de MongoDB");
  }
}

// Exécuter le script avec 10 niveaux d'étude par défaut
seedStudyLevels(10);