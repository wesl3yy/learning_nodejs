const express = require('express');
const db = require('./src/database/db.js');
const routes = require('./src/module/account/controllers.js');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.disable('x-powered-by');

app.use('/api/account', routes);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});