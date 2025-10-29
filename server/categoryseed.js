const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Category = require("./models/categoryModel"); // adjust path if needed

const path = require('path');


const loaded_path = dotenv.config({ path: path.join(__dirname, 'config', '.env') });

console.log(loaded_path)



// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected"))
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Predefined categories
const categories = [
  { name: "Technology", description: "All about tech and gadgets" },
  { name: "Lifestyle", description: "Health, habits, and daily life" },
  { name: "Education", description: "Learning, schools, tutorials" },
  { name: "Health", description: "Wellness, fitness, and medicine" },
  { name: "Travel", description: "Trips, destinations, experiences" },
];

// Seed function
const seedCategories = async () => {
  try {
    // Remove existing categories to avoid duplicates
    await Category.deleteMany();

    // Insert new categories
    await Category.insertMany(categories);

    console.log("Categories seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("Error seeding categories:", error);
    process.exit(1);
  }
};

seedCategories();
