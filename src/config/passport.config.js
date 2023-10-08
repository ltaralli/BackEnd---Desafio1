import passport from "passport";
import GitHubStrategy from "passport-github2";
import local from "passport-local";
import UserServices from "../services/session.js";
import { createHash, isValidPassword } from "../utils/index.js";
import config from "./config.js";
import logger from "../utils/logger.js";

// VARIABLES DE ENTORNO
const githubClientID = config.githubClientID;
const githubClientSecret = config.githubClientSecret;
const githubCallbackURL = config.githubCallbackURL;
const githubScope = config.githubScope;
const userServices = new UserServices();
const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        let user = req.body;
        try {
          let userFound = await userServices.getByEmail(user.email);
          if (userFound) {
            return done(null, false);
          }
          user.password = createHash(user.password);
          let result = await userServices.createUser(user);
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
        let result = await userServices.getByEmail(username);
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
          let user = await userServices.getByEmail(userEmail);
          if (!user) {
            let newUser = {
              first_name: profile._json.login,
              last_name: "",
              email: userEmail,
              password: "",
              age: "",
            };
            try {
              let result = await userServices.createUser(newUser);
              let updatedUser = await userServices.updateLastConnection(
                result.email
              );
              if (!updatedUser) {
                logger.error("No se pudo actualizar la última conexión");
              }
              done(null, result);
            } catch (error) {
              done(error); // Maneja el error al crear el nuevo usuario
            }
          } else {
            done(null, user);
          }
        } catch (error) {
          done(error); // Maneja el error al buscar el usuario por email
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, { id: user._id, role: user.role, email: user.email });
  });

  passport.deserializeUser(async (data, done) => {
    let user = await userServices.getById(data.id);
    user.role = data.role;
    done(null, user);
  });
};

export default initializePassport;
