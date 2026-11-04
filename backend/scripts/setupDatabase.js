import dotenv from "dotenv";
import mongoose from "mongoose";
import { Admin } from "../models/Admin.js";
import BlockedUsers from "../models/BlockedUsers.js";
import Booking from "../models/Booking.js";
import CardTemplate from "../models/CardTemplate.js";
import ContactMessage from "../models/ContactMessage.js";
import Estimation from "../models/Estimation.js";
import OTP from "../models/OTP.js";
import Recommendation from "../models/Recommendation.js";
import Review from "../models/Review.js";
import Service from "../models/Service.js";
import User from "../models/User.js";

dotenv.config();

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is missing from backend/.env. No collections were created.");
  process.exit(1);
}

const models = [
  Admin,
  BlockedUsers,
  Booking,
  CardTemplate,
  ContactMessage,
  Estimation,
  OTP,
  Recommendation,
  Review,
  Service,
  User,
];

try {
  await mongoose.connect(process.env.MONGO_URI);

  for (const model of models) {
    try {
      await model.createCollection();
    } catch (error) {
      if (error.code !== 48) throw error;
    }
    await model.syncIndexes();
    console.log(`Ready: ${model.collection.name}`);
  }

  console.log("Atlas collections and indexes are ready.");
} catch (error) {
  console.error("Database setup failed:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
