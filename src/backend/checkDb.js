require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function checkDatabase() {
  try {
    // Check if tables exist
    console.log('Checking database tables...');
    const tableCheck = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('Tables in database:', tableCheck.rows);

    // If projects table exists, check its contents
    if (tableCheck.rows.some(row => row.table_name === 'projects')) {
      console.log('\nChecking projects table...');
      const projects = await pool.query('SELECT * FROM projects');
      console.log('Projects in database:', projects.rows);
    }
  } catch (err) {
    console.error('Error checking database:', err);
  } finally {
    await pool.end();
  }
}

checkDatabase();
