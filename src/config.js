require("dotenv").config({path: "../.env"});

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

  getEmailService() {
    return this.getString('EMAIL_SERVICE');
  }

  getEmailAuth() {
    return {
      user: this.getString("EMAIL_USER"),
      pass: this.getString("EMAIL_PASSWORD")
    }
  }
}

const configServices = new ConfigServices(process.env);
module.exports = configServices;