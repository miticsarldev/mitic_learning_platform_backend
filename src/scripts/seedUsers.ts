import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import User from "../models/User";
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

// Fonction pour générer un utilisateur factice
const createFakeUser = () => {
    return new User({
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
        username: faker.internet.userName(),
        password: faker.internet.password(),
        email: faker.internet.email(),
        bio: faker.lorem.sentence(),
        role: faker.helpers.arrayElement(["admin", "student", "teacher"]),
        dateOfBirth: faker.date.birthdate({ min: 18, max: 60, mode: "age" }),
        phone: faker.helpers.replaceSymbols("+33 6 ## ## ## ##"), // Format français
        address: faker.location.streetAddress(),
        studyLevel: new mongoose.Types.ObjectId(), // Remplace par un ID valide si besoin
        status: faker.datatype.boolean(),
        isVerified: faker.datatype.boolean(),
        otp: faker.string.numeric(6), // Code OTP à 6 chiffres
        otpExpires: faker.date.future(),
    });
};

// Fonction pour insérer plusieurs utilisateurs
async function seedUsers(nbUsers = 10) {
    await connectDB();

    try {
        const users = Array.from({ length: nbUsers }, createFakeUser);
        await User.insertMany(users);
        console.log(`✅ ${nbUsers} utilisateurs factices insérés !`);
    } catch (error) {
        console.error("❌ Erreur lors de l'insertion des utilisateurs:", error);
    } finally {
        mongoose.connection.close();
        console.log("🔌 Déconnecté de MongoDB");
    }
}

// Exécuter le script
seedUsers(20); // Change le nombre si besoin