const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (your existing HTML files)
app.use(express.static(path.join(__dirname)));

// Root route — serve your main HTML file
app.get('/', (req, res) => {
  // Try network-01.html first (seen in your Render logs), then index.html
  const files = ['index.html', 'network-01.html', 'network.html'];
  for (const file of files) {
    try {
      return res.sendFile(path.join(__dirname, file));
    } catch(e) {}
  }
  res.send('<h1>Network CMD Tool</h1><p>Add your HTML file to the repo root.</p>');
});

app.listen(PORT, () => {
  console.log(`Network CMD Tool running on port ${PORT}`);
});
