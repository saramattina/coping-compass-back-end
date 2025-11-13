const dotenv = require('dotenv');
dotenv.config();
const mongoose = require("mongoose")

const MONGODB_URI = process.env.MONGO_URI;

mongoose.connect(MONGODB_URI);

const db = mongoose.connection;

db.on("connected", () => console.log("MongoDB connected"));
db.on("error", (err) => console.log("MongoDB connection error:", err));

export default db;