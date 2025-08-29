const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Enable CORS for all origins (required for Replit proxy)
app.use(cors({
  origin: true,
  credentials: true
}));

// Serve static files from the current directory
app.use(express.static('.'));

// Handle single page application routing - send index.html for any route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Loralore website server running on http://0.0.0.0:${PORT}`);
  console.log('Server is ready to accept connections!');
});