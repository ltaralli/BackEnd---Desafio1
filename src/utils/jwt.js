import jwt from "jsonwebtoken";
import config from "../config/config.js";

const PRIVATE_KEY = config.private_key_JWT;

export const generateToken = (user) => {
  const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "1h" });
  return token;
};
