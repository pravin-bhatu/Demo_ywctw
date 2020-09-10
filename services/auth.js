const Passport = require('passport');
const Strategy = require('passport-auth0');
const redis = require('redis');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const SESSION_SECRET = process.env.SESSION_SECRET || 'shhhhhhhhh';

const ManagementClient = require('auth0').ManagementClient;
const auth0Client = new ManagementClient({
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJCZExldGtWRXZsbktiZElTT3lLOW5KWXRISXFQTVR2bSIsInNjb3BlcyI6eyJ1c2VycyI6eyJhY3Rpb25zIjpbInJlYWQiLCJ1cGRhdGUiXX0sInN0YXRzIjp7ImFjdGlvbnMiOlsicmVhZCJdfX0sImlhdCI6MTQ1NDM1OTM0OCwianRpIjoiMWFkZDVjOWQ0OGE2ZWEyZjcwNTlkY2I2ODk2ZmY4OTMifQ.PzoBiuGbR8EVAJ5iQtRhbTrY2MlhIhARW6v4pJJUy0w',
  domain: 'auth.youwillchangetheworld.com',
});

class AuthService {
  static normalizeProfile(user) {
    if (user.app_metadata) {
      let data = user.app_metadata;
      if (data.username) user.username = data.username;
      if (data.hasOwnProperty('published')) user.published = data.published;
    }

    if (user.user_metadata) {
      let data = user.user_metadata;
      if (data.name) user.name = data.name;
      if (data.shortBio) user.shortBio = data.shortBio;
      if (data.longBio) user.longBio = data.longBio;

      if (data.socialFacebook) user.socialFacebook = data.socialFacebook;
      if (data.socialTwitter) user.socialTwitter = data.socialTwitter;
      if (data.socialGoogle) user.socialGoogle = data.socialGoogle;
      if (data.socialLinkedIn) user.socialLinkedIn = data.socialLinkedIn;
    }
    return user;
  }

  static getUsers(options) {
    return new Promise((resolve, reject) => {
      auth0Client.getUsers(options)
        .then(response => {
          response.users = response.users || response;
          response.users = response.users.map(user => {
            return AccountsService.normalizeProfile(user);
          });
          resolve(response);
        })
        .catch(reject);
    });
  }

  static getUser(id) {
    return new Promise((resolve, reject) => {
      auth0Client.getUser({id: id})
        .then(user => {
          user = AccountsService.normalizeProfile(user);
          resolve(user);
        })
        .catch(reject);
    });
  }


  // EXPRESS STUFF
  static getConfig() {
    return {
      domain: process.env.AUTH0_DOMAIN || 'auth.youwillchangetheworld.com',
      clientID: process.env.AUTH0_CLIENT_ID || 'PeuAJu9UgEHxly6NSEawLRsexInSMUbn',
      clientSecret: process.env.AUTH0_CLIENT_SECRET || 'e4mF1c5T4GJ04YlkDwbp-A7HceVsM3mIlxaNE_LnfIvIlPv1EUmuxIHAveCOqjXR',
      callbackURL: process.env.AUTH0_CALLBACK_URL || '/auth/callback',
    };
  }

  // Configures passport.
  static configurePassport() {
    Passport.use(
      new Strategy(AuthService.getConfig(), (accessToken, refreshToken, extraParams, profile, done) => {
        return done(null, profile);
      })
    );

    Passport.serializeUser((user, done) => {
      done(null, user);
    });

    Passport.deserializeUser((user, done) => {
      done(null, user);
    });
  }

  static configureSession() {
    const options = {
      secret: SESSION_SECRET,
      resave: true,
      saveUninitialized: true,
    };

    if (process.env.REDIS_URL) {
      options.store = new RedisStore({
        client: redis.createClient(process.env.REDIS_URL),
      });
    }

    return session(options);
  }
}

AuthService.Passport = Passport;
AuthService.Strategy = Strategy;
AuthService.session = session;

module.exports = AuthService;
