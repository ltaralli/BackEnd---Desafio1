import { sendMail } from "../services/mailling/mailling.js";
import { templateForgotPassword } from "../services/mailling/templates/templates.js";
import { generateToken } from "../utils/jwt.js";
import logger from "../utils/logger.js";
import { userModel } from "./db/model/users.model.js";

class userManager {
  constructor() {
    this.model = userModel;
  }

  async getAll() {
    let result;
    try {
      result = await this.model.find();
    } catch (error) {
      logger.error(`${error}`);
    }
    return result;
  }

  async getUser(email) {
    let result;
    try {
      result = await this.model.findOne({ email: email }).select("-password");
    } catch (error) {
      console.log(error);
    }
    return result;
  }

  async getByEmail(email) {
    let result;
    try {
      result = await this.model.findOne({ email: email });
    } catch (error) {
      logger.error(`${error}`);
    }
    return result;
  }

  async getById(id) {
    let result;
    try {
      result = await this.model.findOne({ _id: id });
    } catch (error) {
      logger.error(`${error}`);
    }
    return result;
  }

  async createUser(user) {
    let result;
    try {
      result = this.model.create(user);
    } catch (error) {
      logger.error(`${error}`);
    }
    return result;
  }

  async resetPassword(id, user) {
    let result;
    try {
      result = await this.model.findByIdAndUpdate(id, user, { new: true });
    } catch (error) {
      logger.error(`${error}`);
    }
    return result;
  }

  async getUserByResetToken(token) {
    let user;
    try {
      user = await this.model.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });
    } catch (error) {
      logger.error(`${error}`);
    }
    return user;
  }

  async updateUser(email, fields) {
    let result;
    try {
      result = await this.model.updateOne({ email: email }, fields);
    } catch (error) {
      logger.error(`${error}`);
    }
    return result;
  }

  async sendEmailResetPassword(email) {
    let result;
    try {
      const user = await this.getUser(email);
      const token = await generateToken();
      user.resetPasswordToken = token;
      user.resetPasswordExpires = new Date(Date.now() + 3600000);
      await this.updateUser(email, user);
      const options = await templateForgotPassword(email, token);
      result = await sendMail(options);
    } catch (error) {
      logger.error(`${error}`);
      throw error;
    }
    return result;
  }
}

export default userManager;
