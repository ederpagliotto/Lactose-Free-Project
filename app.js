const express = require('express');
const path = require('path');
const app = express();
const port = 8080;

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/manufacturer', (req, res) => {
  res.render('manufacturer');
});

app.get('/consumer', (req, res) => {
  res.render('consumer');
});

app.get('/products', (req, res) => {
  res.render('products');
});

app.listen(port, () => {
  console.log(`Server running: http://localhost:${port}`);
});
