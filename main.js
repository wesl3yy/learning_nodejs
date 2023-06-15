const express = require('express');
const cors = require('cors');
const db = require('./src/database/db.js');
const AccountController = require('./src/module/account/account.controller.js');
const {AccountServices, AccountTypeServices} = require('./src/module/account/account.services.js');
const {AccountRepository, AccountTypeRepository} = require('./src/module/account/account.repository.js');
const { User, Type } = require('./src/database/model/account.models.js');
require('dotenv').config();

async function main() {
    const app = express();
    const port = process.env.PORT || 3000;

    app.use(express.json());
    app.use(cors());
    app.disable('x-powered-by');

    // TODO: import
    const accountRepository = new AccountRepository(User);
    const accountTypeRepository = new AccountTypeRepository(Type);
    const accountServices = new AccountServices(accountRepository);
    const accountTypeServices = new AccountTypeServices(accountTypeRepository);
    app.use('/api/account', AccountController(accountServices, accountTypeServices));

    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
}

main().catch(err => console.log(err));