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
app.get('/', async (req, res) => {
  
  const fetchPromises = Array.from({ length: 1 }, () => {
    return fetch('https://api.scryfall.com/cards/random')
      .then(res => res.json())
      .catch(err => console.error('Error fetching random card:', err));
  })

  const randomCards = await Promise.all(fetchPromises);

   // Send formatted JSON
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(randomCards, null, 2)); // 'null, 2' pretty-prints the JSON
  //res.json(randomCards);

});

app.get('/cards', (req, res) => {
  const search = req.query.search?.toLowerCase() || '';
  const filtered = cards.filter(card =>
    card.name.toLowerCase().includes(search)  // ← only prefix match
  );
  res.json(filtered);
});

// Route 3: Single card product page
app.get('/card/:url', async (req, res) => {
  const cardName = req.params.url.replace(/-/g, ' '); // "black-lotus" → "black lotus"

  try {
    const response = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(cardName)}`);
    
    if (!response.ok) {
      return res.status(404).json({ error: 'Card not found on Scryfall' });
    }

    const card = await response.json();
    res.json(card);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error retrieving card data' });
  }
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
