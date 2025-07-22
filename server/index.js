import cors from 'cors';
import express from 'express';
const app = express();
app.use(cors());

const PORT = 3001;

// Example MTG card data
const cards = [
  { name: "Black Lotus", type: "Artifact", color: "Colorless", description: "Adds three mana of any single color.", url: "black-lotus"},
  { name: "Lightning Bolt", type: "Instant", color: "Red", description: "Deals 3 damage to any target.", url: "lightning-bolt"},
  { name: "Counterspell", type: "Instant", color: "Blue", description: "Counter target spell.", url: "counterspell" }
];


// Route 1: Home page
app.get('/', (req, res) => {
  res.send('🏠 Welcome to Realms - MTG Card Explorer');
});

app.get('/cards', (req, res) => {
  const search = req.query.search?.toLowerCase() || '';
  console.log( `Searching for cards with prefix: ${search}`);
  const filtered = cards.filter(card =>
    card.name.toLowerCase().includes(search)  // ← only prefix match
  );
  res.json(filtered);
});

// Route 3: Single card product page
app.get('/card/:url', (req, res) => {
  const cardURL = req.params.url;
  const card = cards.find(c => c.url === cardURL);
  console.log(card)
  if (card) {
    res.json(card);
  } else {
    res.status(404).json({ error: 'Card not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
