
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

let users = [];
let recipes = [];
let reviews = [];

let userIdCounter = 1;
let recipeIdCounter = 1;
let reviewIdCounter = 1;

app.post('/register', (req, res) => {
  const { name } = req.body;
  const user = { id: userIdCounter++, name };
  users.push(user);
  res.json(user);
});

app.post('/recipes', (req, res) => {
  const { title, content, imageUrl, category, username } = req.body;
  const recipe = { id: recipeIdCounter++, title, content, imageUrl, category, username, reviews: [] };
  recipes.push(recipe);
  res.json(recipe);
});

app.get('/recipes', (req, res) => {
  res.json(recipes);
});

app.get('/recipes/:id', (req, res) => {
  const recipe = recipes.find(r => r.id === parseInt(req.params.id));
  if (!recipe) return res.status(404).json({ error: 'ไม่พบสูตรอาหาร' });
  res.json(recipe);
});

app.post('/recipes/:id/reviews', (req, res) => {
  const { username, rating, comment } = req.body;
  const recipe = recipes.find(r => r.id === parseInt(req.params.id));
  if (!recipe) return res.status(404).json({ error: 'ไม่พบสูตรอาหาร' });
  if (recipe.username === username)
    return res.status(403).json({ error: 'ไม่สามารถรีวิวสูตรของตัวเองได้' });
  if (recipe.reviews.find(r => r.username === username))
    return res.status(400).json({ error: 'คุณได้รีวิวสูตรนี้แล้ว' });
  const review = { id: reviewIdCounter++, username, rating, comment };
  recipe.reviews.push(review);
  res.json(review);
});

app.listen(PORT, () => {
  console.log(`API พร้อมใช้งานที่ http://localhost:${PORT}`);
});
