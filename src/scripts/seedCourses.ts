import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import Course from "../models/Course"; // Assure-toi que le chemin est correct
import Lessons from "../models/Lessons"; // Assure-toi que le chemin est correct
import Section from "../models/Section"; // Assure-toi que le chemin est correct
import { config } from "dotenv";
config();

const generateFakeData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);

        console.log("🛢️ Connexion à MongoDB réussie !");

        for (let i = 0; i < 30; i++) {
            const courseData = {
                title: faker.lorem.words(3),
                description: faker.lorem.sentence(),
                price: faker.number.int({ min: 10, max: 200 }),
                isCertified: faker.datatype.boolean(),
                duration: `${faker.number.int({ min: 1, max: 10 })} heures`,
                created_by: "6774612d415338a3d23e584a",
                studyLevel_id: "6773e80ac8998e62be3a8540",
                job_id: "67596e4b764dc8267155a431",
                category_id: "6772aed8e7e53cbf7b616690",
                path_image: `/uploads/${faker.image.urlLoremFlickr({ category: "education" })}`,
                path_video: `/uploads/${faker.string.uuid()}.mp4`,
            };

            const course = new Course(courseData);
            await course.save();

            console.log(`✅ Cours ajouté : ${course.title}`);

            for (let j = 0; j < 3; j++) {
                const lessonData = {
                    title: faker.lorem.words(2),
                    description: faker.lorem.sentence(),
                    duration: `${faker.number.int({ min: 5, max: 60 })} min`,
                    order: j + 1,
                    course_id: course._id,
                };

                const lesson = new Lessons(lessonData);
                await lesson.save();

                console.log(`   ✅ Leçon ajoutée : ${lesson.title}`);

                for (let k = 0; k < 2; k++) {
                    const sectionData = {
                        title: faker.lorem.words(3),
                        description: faker.lorem.sentence(),
                        lesson_id: lesson._id,
                        type: "cours",
                        order: k + 1,
                        path_image: `/uploads/${faker.string.uuid()}.png`,
                        path_video: `/uploads/${faker.string.uuid()}.mp4`,
                    };

                    const section = new Section(sectionData);
                    await section.save();

                    console.log(`      ✅ Section ajoutée : ${section.title}`);
                }
            }
        }

        console.log("🎉 Génération de données terminée !");
        mongoose.connection.close();
    } catch (error) {
        console.error("❌ Erreur lors de l'insertion des données factices", error);
    }
};

generateFakeData();

