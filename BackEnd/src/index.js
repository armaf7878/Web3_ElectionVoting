const express = require('express');
const cors = require('cors');
const app = express();
const port = 8000;

//Parse Json
app.use(express.json());

//Cors Config
app.use(cors())

//Connect contract
const contract = require('./config/blockchain');

//Connect DB
const db = require('./config/db');
db.connect();

//Route Init
const route = require('./routes');
route(app);

app.get('/', (req, res) => { res.send("Server Okay !")});
app.listen(port, () => console.log(`App Listening At HTTP://localhost:${port}`));