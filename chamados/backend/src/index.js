const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Chamado backend running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
