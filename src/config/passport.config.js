import passport from "passport";
import GitHubStrategy from "passport-github2";
import local from "passport-local";
import userManager from "../DAO/sessionDAO.js";
import { createHash, isValidPassword } from "../utils/index.js";

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

        let userAdmin = "adminCoder@coder.com";
        let passAdmin = "adminCod3r123";

        if (
          !result ||
          !isValidPassword(result, password) ||
          username != userAdmin ||
          password != passAdmin
        ) {
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
        clientID: "Iv1.83ba028456432d13",
        clientSecret: "eb57a05259fa98f4cd86e5105df9ef8f14a7d01f",
        callbackURL: "http://localhost:8080/api/session/githubcallback",
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
