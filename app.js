const express = require('express');
const { Pool } = require('pg');
const app = express();
app.use(express.json());

//SQL CONNECTION STRING
const connectionString = 'postgresql://benoy:MKrdCQcy9Gw7vNCld2_11Q@calmed-mantis-14410.7tt.aws-us-east-1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full&sslrootcert=root.crt';

const pool = new Pool({
    connectionString: connectionString,
  });

// Getting scores and sending to frontend
async function getHighestScoresServer() {
    console.log("Getting scores from server");
    const res = await pool.query('SELECT * FROM scores ORDER BY SCORE DESC LIMIT 10;');
    return res.rows;
  }
  app.get('/getHighestScores', async (req, res) => {
      const leaderboard = await getHighestScoresServer();
      res.json(leaderboard);
  });

//SENDING SCORES BACKEND
async function sendScoresServer(name, score) {
    const res = await pool.query('INSERT INTO scores (name, score) VALUES (\'' + name + '\', ' + score + ');');
    console.log(res);
    return res.rowCount;
  }
  app.post('/sendScore', async (req, res) => {
    const { name, score } = req.body;
    const rowCount = await sendScoresServer(name, score);
  });

//create sql table called scores
async function createTable() {
    const res = await pool.query('');
    console.log(res.rows);
  }
  createTable();



  async function DELETE(score) {
    const res = await pool.query('DELETE FROM defaultdb.scores WHERE score <' + score + ';');
    console.log(res);
    return res.rowCount;
  }

  //DELETE(5000);





app.use(express.static('public'));

app.listen(3000, () => console.log('Server listening on port 3000'));