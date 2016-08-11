let express = require('express');
let app = express();

app.get('/', (req, res) => {
  res.send('George!');
})

app.get('/hostage', (req, res) => {
  res.send('Hostage!');
})

let server = app.listen(3000, () => {
  console.log(`Server running at http://localhost: ${server.address().port}`);
})

