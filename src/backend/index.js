require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Heroku
  }
});

// Routes
app.get('/api/projects', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM projects ORDER BY bullish_votes DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/projects', async (req, res) => {
  const { name, description, website, tokenInfo, transactionHash } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO projects (name, description, website, token_info, transaction_hash) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, description, website, tokenInfo, transactionHash]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/votes', async (req, res) => {
  const { projectId, voteType } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO votes (project_id, vote_type) VALUES ($1, $2) RETURNING *',
      [projectId, voteType]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
