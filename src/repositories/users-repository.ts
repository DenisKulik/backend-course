import { ObjectId } from "mongodb";
import { UserDBType } from "../types";
import { UserModel } from "./db";

export interface IUsersRepository {
  getAllUsers(): Promise<UserDBType[]>;
  createUser(user: UserDBType): Promise<UserDBType>;
  findUserById(id: ObjectId): Promise<UserDBType | null>;
  findUserByLoginOrEmail(loginOrEmail: string): Promise<UserDBType | null>;
}

export class UsersRepository {
  async getAllUsers() {
    return UserModel.find().sort({ createdAt: -1 }).lean();
  }

  async createUser(user: UserDBType): Promise<UserDBType> {
    const result = await UserModel.create(user);
    return user;
  }

  async findUserById(id: ObjectId) {
    const user = await UserModel.findOne({ _id: id });
    if (!user) return null;

    return user;
  }

  async findUserByLoginOrEmail(loginOrEmail: string) {
    const user = await UserModel.findOne({
      $or: [{ userName: loginOrEmail }, { email: loginOrEmail }],
    });
    return user;
  }
}
