import app from './app.js';
import { seedDatabase } from './db/database.js';

const PORT = process.env.PORT || 3000;

// Seed in-memory database
seedDatabase();

app.listen(PORT, () => {
  console.log(`\nShopFlow server running on http://localhost:${PORT}`);
  console.log('Database: In-memory (resets on restart)');
  console.log('Caching: None — every request hits the data store.\n');
});
