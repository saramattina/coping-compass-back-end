const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const slugify = require('slugify');
require("dotenv").config();


const PORT = process.env.PORT || 5000;
const app = express();
const prisma = new PrismaClient();

app.use(cors()); 
app.use(express.json()); 

// MIDDLEWARE
const checkAdmin = (req, res, next) => {
  const token = req.headers['authorization'];
  if (token === process.env.ADMIN_SECRET) {
    next(); // They are admin, proceed to the route!
  } else {
    res.status(403).json({ error: "Unauthorized" });
  }
};

// ROUTE: Get all published articles
app.get('/api/articles', async (req, res) => {
  const articles = await prisma.article.findMany({
    where: { published: true }
  });
  res.json(articles);
});

// GET one article by slug
app.get('/api/articles/:slug', async (req, res) => {
  const { slug } = req.params;
  const article = await prisma.article.findUnique({
    where: { slug: slug }
  });
  res.json(article);
});


// ROUTE: Create a new article
app.post('/api/articles', checkAdmin, async (req, res) => {
  const { title, content } = req.body; 

  const generatedSlug = slugify(title, {
    lower: true,  
    strict: true, 
    trim: true 
  });

  try {
    const article = await prisma.article.create({
      data: { 
        title, 
        content, 
        slug: generatedSlug 
      }
    });
    res.status(201).json(article);
  } catch (error) {
    res.status(400).json({ error: "A post with a similar title already exists." });
  }
});


// UPDATE an article by ID
app.put('/api/articles/:id', checkAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const updatedArticle = await prisma.article.update({
      where: { id: parseInt(id) },
      data: { title, content },
    });
    res.json(updatedArticle);
  } catch (error) {
    res.status(404).json({ error: "Post not found or update failed" });
  }
});

app.delete('/api/articles/:id', checkAdmin,async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.article.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(404).json({ error: "Post not found" });
  }
});

app.listen(PORT, () => console.log(`Server ready at http://localhost:${PORT}`));