import userManager from "../DAO/sessionDAO.js";

export default class UserServices {
  constructor() {
    this.dao = new userManager();
  }

  async getAll() {
    let users = await this.dao.getAll();
    return users;
  }

  async getByEmail(email) {
    let user = await this.dao.getByEmail(email);
    return user;
  }

  async getUser(email) {
    let user = await this.dao.getUser(email);
    return user;
  }

  async getById(uid) {
    let user = await this.dao.getById(uid);
    return user;
  }

  async createUser(user) {
    let result = await this.dao.createUser(user);
    return result;
  }
}
