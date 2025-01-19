import { Collection, Db, MongoClient } from "mongodb";
import { Course } from "../types";

const mongoUri = process.env.mongoUri || "mongodb://127.0.0.1:27017";

const client: MongoClient = new MongoClient(mongoUri);
const schoolDb: Db = client.db("school");
export const productsCollection: Collection<Course> =
  schoolDb.collection<Course>("courses");

export const connectDB = async () => {
  try {
    await client.connect();
    await client.db("school").command({ ping: 1 });
    console.log("Connected successfully to server");
  } catch {
    console.log("Failed to connect to server");
    await client.close();
  }
};
