const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
require("dotenv").config();

const PORT = process.env.PORT || 5000;
const app = express();
const prisma = new PrismaClient();

app.use(cors()); 
app.use(express.json()); 

// ROUTE: Get all published articles
app.get('/api/articles', async (req, res) => {
  const articles = await prisma.article.findMany({
    where: { published: true }
  });
  res.json(articles);
});

// ROUTE: Create a new article
app.post('/api/articles', async (req, res) => {
  const { title, slug, content } = req.body;
  try {
    const article = await prisma.article.create({
      data: { title, slug, content }
    });
    res.status(201).json(article);
  } catch (error) {
    res.status(400).json({ error: "Slug must be unique" });
  }
});

app.listen(PORT, () => console.log(`Server ready at http://localhost:${PORT}`));