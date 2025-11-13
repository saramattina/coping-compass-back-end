import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
  },
  content: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    validate: {
      validator: arr => arr.length <= 5,
      message: 'A maximum of 5 tags are allowed.',
    }
  }
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;