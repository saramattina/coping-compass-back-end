import express from 'express';
import Article from '../models/articles';

const router = express.Router();

// GET all
router.get("/", async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1});
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new article
router.post("/", async (req, res) => {
  const article = new Article({
    title: req.body.title,
    date: req.body.date,
    content: req.body.content,
  });
  try {
    const newArticle = await article.save();
    res.status(201).json(newArticle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET one
router.get("/:id", getArticle, (req, res) => {
  res.json(res.article);
});

export default router;