const express = require('express');
const { Pool } = require('pg');
const app = express();
app.use(express.json());

//SQL CONNECTION STRING
const connectionString = '';

const pool = new Pool({
    connectionString: connectionString,
  });

//Getting scores and sending to frontend
async function getHighestScoresServer() {
    console.log("Getting scores from server");
    const res = await pool.query('');
    return res.rows;
  }
  app.get('/getHighestScores', async (req, res) => {
      const leaderboard = await getHighestScoresServer();
      res.json(leaderboard);
  });

//SENDING SCORES BACKEND
async function sendScoresServer(name, score) {
    const res = await pool.query('');
    return res.rowCount;
  }
  app.post('/sendScore', async (req, res) => {
    const { name, score } = req.body;
    const rowCount = await sendScoresServer(name, score);
  });

app.use(express.static('public'));

app.listen(3000, () => console.log('Server listening on port 3000'));