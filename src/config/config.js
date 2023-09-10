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
  private_key_JWT: process.env.PRIVATE_KEY_JWT,
  gmail_user_auth: process.env.GMAIL_USER_AUTH,
  gmial_pass_auth: process.env.GMAIL_PASS_AUTH,
};
