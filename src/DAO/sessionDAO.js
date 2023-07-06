import { userModel } from "./db/model/users.model.js";
import mongoose from "mongoose";

class userManager {
  constructor() {
    this.model = userModel;
  }

  async getAll() {
    let result;
    try {
      result = await this.model.find();
    } catch (error) {
      console.log(error);
    }
    return result;
  }

  async getByEmail(email) {
    let result;
    console.log(email);
    try {
      result = await this.model.findOne({ email: email });
    } catch (error) {
      console.log(error);
    }
    return result;
  }

  async createUser(user) {
    let result;
    try {
      result = this.model.create(user);
    } catch (error) {
      console.log(error);
    }
    return result;
  }
}

export default userManager;
