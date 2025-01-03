const express = require('express');
const { Client } = require('pg');
const bodyParser = require('body-parser');
const app = express();

// PostgreSQL接続設定
const client = new Client({
  host: 'localhost',
  user: 'postgres',     // PostgreSQLのユーザー名
  password: 'postgres', // PostgreSQLのパスワード
  database: 'testdb',
  port: 5432,
});

client.connect(err => {
  if (err) {
    console.error('Database connection error', err.stack);
  } else {
    console.log('Connected to PostgreSQL!');
  }
});

// ミドルウェア設定
app.use(bodyParser.urlencoded({ extended: true }));

// ホーム画面
app.get('/', (req, res) => {
  res.send(`
    <h1>Home</h1>
    <p><a href="/register">Go to Register</a></p>
    <p><a href="/search">Go to Search</a></p>
  `);
});

// 登録画面
app.get('/register', (req, res) => {
  res.send(`
    <h1>Register</h1>
    <form action="/register" method="POST">
      <input type="text" name="data" placeholder="Enter something" required />
      <button type="submit">Register</button>
    </form>
  `);
});

// 登録処理
app.post('/register', (req, res) => {
  const inputData = req.body.data;
  const query = 'INSERT INTO data_table (data) VALUES ($1)';
  client.query(query, [inputData], (err, result) => {
    if (err) {
      console.error('Error executing query', err.stack);
      res.send('Error registering data');
    } else {
      res.send('Data Registered! <a href="/search">Search</a> | <a href="/">Home</a>');
    }
  });
});

// 検索画面
app.get('/search', (req, res) => {
  const query = 'SELECT * FROM data_table';
  client.query(query, (err, result) => {
    if (err) {
      console.error('Error executing query', err.stack);
      res.send('Error fetching data');
    } else {
      let output = '<h1>Registered Data</h1>';
      result.rows.forEach(row => {
        output += `<p>${row.data}</p>`;
      });
      output += '<a href="/">Back to Home</a>';
      res.send(output);
    }
  });
});

// サーバーを起動
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
