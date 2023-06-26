const express = require('express');
const cors = require('cors');
const AccountController = require('./modules/account/account.controller.js');
const { AccountServices, UserTokenService} = require('./modules/account/account.services.js');
const { AccountRepository, UserTokenRepository} = require('./modules/account/account.repository.js');
const { User, UserToken } = require('./database/model/account.models.js');
const configServices = require('./config.js');
const MongoConnect = require('./database/db.js');

async function main() {
    // INFO: connect database
    const database = MongoConnect(configServices.getMongoURI())
    database.on('error', (error) => {
        console.log(error)
    })
    database.once('connected', () => {
        console.log('Database Connected');
    })

    // INFO: config server
    const app = express();
    app.use(express.json());
    app.use(cors());
    app.disable('x-powered-by');

    // INFO: import
    const accountRepository = new AccountRepository(User);
    const userTokenRepository = new UserTokenRepository(UserToken);
    const accountServices = new AccountServices(accountRepository);
    const userTokenService = new UserTokenService(userTokenRepository);
    app.use('/api/account', AccountController(accountServices, userTokenService));

    const port = configServices.getPORT();
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
}

main().catch(err => console.log(err));