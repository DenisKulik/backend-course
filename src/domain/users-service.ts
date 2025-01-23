import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import { UsersRepository } from "../repositories";

export class UsersService {
  repository = new UsersRepository();
  async createUser(login: string, email: string, password: string) {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(password, passwordSalt);

    const user = {
      _id: new ObjectId(),
      userName: login,
      email,
      passwordHash,
      passwordSalt,
      createdAt: new Date(),
    };

    return this.repository.createUser(user);
  }

  async findUserById(id: ObjectId) {
    return this.repository.findUserById(id);
  }

  async checkCredentials(loginOrEmail: string, password: string) {
    const user = await this.repository.findUserByLoginOrEmail(loginOrEmail);
    if (!user) return false;

    const passwordHash = await this._generateHash(password, user.passwordSalt);
    if (passwordHash !== user.passwordHash) {
      return false;
    }

    return user;
  }

  async _generateHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt);
  }
}
