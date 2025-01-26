import jwt from "jsonwebtoken";
import { UserDBType } from "../types";
import { settings } from "../settings";
import { ObjectId } from "mongodb";

export class JwtService {
  async createJWT(user: UserDBType) {
    const token = jwt.sign({ userId: user._id }, settings.JWT_SECRET, {
      expiresIn: "1h",
    });

    return {
      resultCode: 0,
      data: {
        token,
      },
    };
  }

  async getUserIdByToken(token: string) {
    try {
      const result: any = jwt.verify(token, settings.JWT_SECRET);
      return new ObjectId(result.userId);
    } catch {
      return null;
    }
  }
}
