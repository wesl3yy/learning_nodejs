const express = require('express');
const cors = require('cors');
const db = require('./src/database/db.js');
// const routes = require('./src/module/account/controllers.js');
const AccountController = require('./src/module/account/account.controller.js');
const AccountServices = require('./src/module/account/account.services.js');
const AccountRepository = require('./src/module/account/account.repository.js');
const { User } = require('./src/database/model/models.js');
require('dotenv').config();

async function main() {
    const app = express();
    const port = process.env.PORT || 3000;

    app.use(express.json());
    app.use(cors());
    app.disable('x-powered-by');

    // TODO: import
    const accountRepository = new AccountRepository(User)
    const accountServices = new AccountServices(accountRepository);
    app.use('/api/account', AccountController(accountServices));

    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
}

main().catch(err => console.log(err));