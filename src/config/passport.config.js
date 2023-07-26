import passport from "passport";
import GitHubStrategy from "passport-github2";
import local from "passport-local";
import userManager from "../DAO/sessionDAO.js";
import { createHash, isValidPassword } from "../utils/index.js";
import config from "./config.js";

// VARIABLES DE ENTORNO
const githubClientID = config.githubClientID;
const githubClientSecret = config.githubClientSecret;
const githubCallbackURL = config.githubCallbackURL;
const githubScope = config.githubScope;

const managerSession = new userManager();
const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        let user = req.body;
        try {
          let userFound = await managerSession.getByEmail(user.email);
          if (userFound) {
            return done(null, false);
          }
          user.password = createHash(user.password);
          let result = await managerSession.createUser(user);
          return done(null, result);
        } catch (error) {
          return done("Error al registrar el usuario " + error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        let result = await managerSession.getByEmail(username);
        if (!result || !isValidPassword(result, password)) {
          return done(null, false);
        }
        return done(null, result);
      }
    )
  );

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: githubClientID,
        clientSecret: githubClientSecret,
        callbackURL: githubCallbackURL,
        scope: ["user:email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let userEmail = profile.emails[0].value;
          let user = await managerSession.getByEmail(userEmail);
          if (!user) {
            let newUser = {
              first_name: profile._json.login,
              last_name: "",
              email: userEmail,
              password: "",
              age: "",
            };
            let result = await managerSession.createUser(newUser);
            done(null, result);
          } else {
            done(null, user);
          }
        } catch (error) {
          done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await managerSession.getById(id);
    done(null, user);
  });
};

export default initializePassport;
