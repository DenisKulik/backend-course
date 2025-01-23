import { ObjectId } from "mongodb";
import { usersCollection } from "./db";
import { UserDBType } from "../types";

export interface IUsersRepository {
  getAllUsers(): Promise<UserDBType[]>;
  createUser(user: UserDBType): Promise<UserDBType>;
  findUserById(id: ObjectId): Promise<UserDBType | null>;
  findUserByLoginOrEmail(loginOrEmail: string): Promise<UserDBType | null>;
}

export class UsersRepository {
  async getAllUsers() {
    return usersCollection.find().sort("createdAt", -1).toArray();
  }

  async createUser(user: UserDBType): Promise<UserDBType> {
    const result = await usersCollection.insertOne(user);
    return user;
  }

  async findUserById(id: ObjectId) {
    const user = await usersCollection.findOne({ _id: id });
    if (!user) return null;

    return user;
  }

  async findUserByLoginOrEmail(loginOrEmail: string) {
    const user = await usersCollection.findOne({
      $or: [{ userName: loginOrEmail }, { email: loginOrEmail }],
    });
    return user;
  }
}
