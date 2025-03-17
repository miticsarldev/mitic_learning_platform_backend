import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import Category from "../models/Category"; // Assurez-vous que le chemin est correct
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

// Génération d'une catégorie factice
const createFakeCategory = () => {
  return new Category({
    name: faker.commerce.department(),
    description: faker.commerce.productDescription(),
  });
};

// Insertion de plusieurs catégories
async function seedCategories(nbCategories = 10) {
  await connectDB();

  try {
    const categories = Array.from({ length: nbCategories }, createFakeCategory);
    await Category.insertMany(categories);
    console.log(`✅ ${nbCategories} catégories insérées avec succès !`);
  } catch (error) {
    console.error("❌ Erreur lors de l'insertion des catégories:", error);
  } finally {
    mongoose.connection.close();
    console.log("🔌 Déconnecté de MongoDB");
  }
}

// Exécuter le script avec 10 catégories par défaut
seedCategories(10);
