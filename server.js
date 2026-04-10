```javascript
// Import required packages
const express = require('express');
const cors = require('cors');
const apikeyMiddleware = require('./middleware/apikey');
const { extractKeywords } = require('./utils/extractKeywords');
const { generateMetaTitle, generateMetaDescription } = require('./utils/generateMeta");

// Initialize Express app
const app = express();
app.use(express.json());
app.use(cors());

// API key authentication middleware
app.use(apikeyMiddleware);

// Route to generate SEO-optimized meta tags and keywords
app.post('/optimize', (req, res) => {
  // Validate input
  if (!req.body.name || !req.body.description) {
    return res.json({ success: false, error: 'validation', message: 'Product name and description are required' });
  }

  // Extract keywords
  const keywords = extractKeywords(req.body.name, req.body.description);

  // Generate meta title and meta description
  const metaTitle = generateMetaTitle(req.body.name, keywords);
  const metaDescription = generateMetaDescription(req.body.name, req.body.description, keywords);

  // Return SEO-optimized meta tags and keywords
  res.json({ success: true, data: { metaTitle, metaDescription, keywords: keywords.slice(0, 5) } });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'not_found', message: 'Route not found' });
});

// Global error handler
app.use((err, req, res) => {
  console.error(err);
  res.status(500).json({ success: false, error: 'internal_server_error', message: 'Internal server error' });
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
```


// middleware/apikey.js
```javascript
const apikeyMiddleware = (req, res, next) => {
  const apiKey = req.header('X-API-Key');
  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ success: false, error: 'unauthorized', message: 'Invalid API key' });
  }
  next();
};

module.exports = apikeyMiddleware;
```

// utils/extractKeywords.js
```javascript
const natural = require('natural');
const Tokenizer = new natural.WordTokenizer();

const extractKeywords = (name, description) => {
  const tokens = Tokenizer.tokenize(`${name} ${description}`);
  const-stopwords = natural.stopwords;
  const keywords = tokens.filter((token) => !stopwords.includes(token.toLowerCase()));
  return keywords;
};

module.exports = { extractKeywords };
```

// utils/generateMeta.js
```javascript
const string = require('string');

const generateMetaTitle = (name, keywords) => {
  const title = `${name} - ${keywords.join(', ')}`;
  return string(title).truncate(60).s;
};

const generateMetaDescription = (name, description, keywords) => {
  const desc = `${name} - ${description} ${keywords.join(', ')}`;
  return string(desc).truncate(160).s;
};

module.exports = { generateMetaTitle, generateMetaDescription };
```