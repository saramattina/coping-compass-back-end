import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
const SESSION_SECRET = process.env.SESSION_SECRET;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));


// Routes



db.on("connected", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log("listening on port", PORT);
  });
});