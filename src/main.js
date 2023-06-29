import express from 'express';
import cors from 'cors';
import NodeMailer from 'nodemailer';
import './common/express';
import { HttpErrorHandler } from './common/http_error_handler';
import { mongoConnect } from './database/db';
import { MailServices } from './shared/mail.services';
import { configServices } from './config';
import { AccountRepository } from './modules/account/account.repository';
import { AccountServices } from './modules/account/account.services';
import { AccountController } from './modules/account/account.controller';
import { UserTokenRepository } from './modules/account/account.repository';
import { UserTokenService } from './modules/account/account.services';
import { User } from './database/model/user.models';
import { UserToken } from './database/model/user.models';
import { AuthController } from './modules/auth/auth.controller';
import { UserRepository } from './modules/user/user.repository';
import { UserServices } from './modules/user/user.services';
import { AuthServices } from './modules/auth/auth.services';
import { AuthSecret } from './modules/auth/auth.secret';
import { UserSecret } from './database/model/auth-secret.model';

async function main() {
    // INFO: connect database
    const database = mongoConnect(configServices.getMongoURI())
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

    // INFO: import mail services
    const mailServices = new MailServices(configServices, NodeMailer);
    // INFO: import
    // const accountRepository = new AccountRepository(User);
    // const userTokenRepository = new UserTokenRepository(UserToken);
    // const accountServices = new AccountServices(accountRepository);
    // const userTokenService = new UserTokenService(userTokenRepository, mailServices);
    // app.use('/api/account', AccountController(accountServices, userTokenService));

    // INFO: import user module
    const userRepository = new UserRepository(User);
    const userServices = new UserServices(userRepository);
    // INFO: import auth module
    const authSecret = new AuthSecret(UserSecret);
    const authServices = new AuthServices(userServices, authSecret, mailServices);
    app.use('/api/auth', AuthController(authServices, userServices));

    app.use(HttpErrorHandler);
    const port = configServices.getPORT();
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
}

main().catch(err => console.log(err));