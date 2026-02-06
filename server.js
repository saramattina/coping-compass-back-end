const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const slugify = require('slugify');
require("dotenv").config();


const PORT = process.env.PORT || 5000;
const app = express();
const prisma = new PrismaClient();
const adminPassword = process.env.ADMIN_PASSWORD;

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

// PUBLIC ROUTE: Get all published articles
app.get('/api/articles', async (req, res) => {
  const articles = await prisma.article.findMany({
    where: { published: true }
  });
  res.json(articles);
});

// PUBLIC GET one article by slug
app.get('/api/articles/:slug', async (req, res) => {
  const { slug } = req.params;
  const article = await prisma.article.findUnique({
    where: { slug: slug }
  });
  res.json(article);
});


// ADMIN LOGIN
app.post('/api/login', (req, res) => {
  const { password } = req.body;
  if (password === adminPassword) {
    // Add JWT token in future
    res.json({ success: true, token: "secret-admin-token" });
  } else {
    res.status(401).json({ success: false, message: "Invalid Password" });
  }
});

// ADMIN CREATE a new article
app.post('/api/articles', checkAdmin, async (req, res) => {
  const { title, content } = req.body; 

  const token = req.headers['authorization'];
  
  if (token !== "secret-admin-token") {
    return res.status(403).json({ error: "Forbidden: You are not the admin" });
  }

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


// ADMIN UPDATE an article by ID
app.put('/api/articles/:id', checkAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  const token = req.headers['authorization'];
  
  if (token !== "secret-admin-token") {
    return res.status(403).json({ error: "Forbidden: You are not the admin" });
  }

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

// ADMIN DELETE an article by ID
app.delete('/api/articles/:id', checkAdmin,async (req, res) => {
  const { id } = req.params;

  const token = req.headers['authorization'];
  
  if (token !== "secret-admin-token") {
    return res.status(403).json({ error: "Forbidden: You are not the admin" });
  }
  
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