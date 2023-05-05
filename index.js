const express = require('express');
const connectToMongo = require("./db");

connectToMongo();
const app = express();
const port = 4000;

app.use(express.json());
// available routes
app.use('/api/auth', require("./routes/auth"));

app.listen(port, () => {
    console.log(` App started on port ${port}`);
  })