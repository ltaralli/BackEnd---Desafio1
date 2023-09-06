import dotenv from "dotenv";

dotenv.config();

export default {
  env: process.env.ENV,
  port: process.env.PORT,
  mongoUrl: process.env.MONGO_URL,
  githubClientID: process.env.GITHUB_CLIENT_ID,
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
  githubCallbackURL: process.env.GITHUB_CALLBACK_URL,
  githubScope: process.env.GITHUB_SCOPE,
  sessionSecret: process.env.SESSION_SECRET,
};
