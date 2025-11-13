import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './db/connection.js';
import articleRoutes from './routes/articleRoutes.js';


dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));


// Routes
app.use("/articles", articleRoutes);


db.on("connected", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log("listening on port", PORT);
  });
});