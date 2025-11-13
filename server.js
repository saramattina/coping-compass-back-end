import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './db/connection.js';

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
const SESSION_SECRET = process.env.SESSION_SECRET;

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Controllers
import articleController from './controllers/articles.js';


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));


// Routes
app.get("/", (req, res) => {
  res.render("index.js");
});

app.use("/articles", articleController);


db.on("connected", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log("listening on port", PORT);
  });
});