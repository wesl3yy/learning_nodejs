import { config } from 'dotenv';
config({path: "../.env"});


class ConfigServices {
  constructor(env) {
    this.env = env;
  }

  getNumber(v) {
    return Number(this.env[v]);
  }

  getString(v) {
    return this.env[v];
  }

  getPORT() {
    return this.getNumber('PORT') || 3000;
  }

  getMongoURI() {
    return this.getString('DATABASE_URI');
  }

  getJWTConfig() {
    return {
      jwtSecret: this.getString('JWT_SECRET'),
      expiresIn: this.getString('EXPIRES_IN')
    }
  }

  getEmailConfig() {
    return {
      user: this.getString("EMAIL_USER"),
      pass: this.getString("EMAIL_PASSWORD"),
      service: this.getString('EMAIL_SERVICE')
    }
  }
}

export const configServices = new ConfigServices(process.env);

