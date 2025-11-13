import express from "express";
import {
  getArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle
} from "../controllers/articles.js";

const router = express.Router();

router.get("/", getArticles);
router.get("/:id", getArticle);
router.post("/", createArticle);
router.put("/:id", updateArticle);
router.delete("/:id", deleteArticle);

export default router;
