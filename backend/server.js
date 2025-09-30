import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
//import { Sequelize } from "sequelize";
import postRoutes from "./routes/posts.routes.js";
import sequelize from './utils/db.js';
import userRoutes from './routes/user.routes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(postRoutes);
app.use(userRoutes);
app.use(express.static("uploads"));

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to Supabase Postgres");

    // Sync models later if you define them
    await sequelize.sync();

    app.listen(9090, () => {
      console.log("🚀 Server running on port 9090");
    });
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
};

start();