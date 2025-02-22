require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Database configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to database successfully');
  }
});

// API Routes
app.get('/api/projects', async (req, res) => {
  try {
    console.log('Fetching projects...');
    const { rows } = await pool.query(
      'SELECT * FROM projects ORDER BY bullish_votes DESC'
    );
    console.log('Projects fetched:', rows);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
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
    console.error('Error creating project:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

app.post('/api/votes', async (req, res) => {
  const { projectId, voteType, userFingerprint } = req.body;
  const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  try {
    // Check if user has already voted for this project
    const existingVote = await pool.query(
      'SELECT * FROM votes WHERE project_id = $1 AND user_fingerprint = $2',
      [projectId, userFingerprint]
    );

    if (existingVote.rows.length > 0) {
      // If vote type is different, update the vote
      if (existingVote.rows[0].vote_type !== voteType) {
        await pool.query(
          'UPDATE votes SET vote_type = $1 WHERE project_id = $2 AND user_fingerprint = $3',
          [voteType, projectId, userFingerprint]
        );
      } else {
        // Remove the vote if clicking the same type again
        await pool.query(
          'DELETE FROM votes WHERE project_id = $1 AND user_fingerprint = $2',
          [projectId, userFingerprint]
        );
      }
    } else {
      // Create new vote
      await pool.query(
        'INSERT INTO votes (project_id, vote_type, user_fingerprint, ip_address) VALUES ($1, $2, $3, $4)',
        [projectId, voteType, userFingerprint, ipAddress]
      );
    }

    // Get updated project data
    const { rows } = await pool.query(
      'SELECT * FROM projects WHERE id = $1',
      [projectId]
    );

    // Get user's current vote for this project
    const userVote = await pool.query(
      'SELECT vote_type FROM votes WHERE project_id = $1 AND user_fingerprint = $2',
      [projectId, userFingerprint]
    );

    // Return project data with user's vote status
    res.json({
      ...rows[0],
      userVote: userVote.rows.length > 0 ? userVote.rows[0].vote_type : null
    });
  } catch (err) {
    console.error('Error recording vote:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

app.get('/api/projects/votes/:fingerprint', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT project_id, vote_type FROM votes WHERE user_fingerprint = $1',
      [req.params.fingerprint]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching user votes:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

app.get('/api/projects/votes/:fingerprint', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT project_id, vote_type FROM votes WHERE user_fingerprint = $1',
      [req.params.fingerprint]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching user votes:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Error handling for 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
