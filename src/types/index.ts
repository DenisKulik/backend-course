import { Request } from "express";
import { ObjectId } from "mongodb";

declare global {
  namespace Express {
    export interface Request {
      user?: UserDBType;
    }
  }
}

export type RequestBody<T> = Request<{}, {}, T>;
export type RequestParams<T> = Request<T>;
export type RequestQuery<T> = Request<{}, {}, {}, T>;
export type RequestBodyParams<TBody, TParams> = Request<TParams, {}, TBody>;

export type Course = {
  id: number;
  title: string;
  price: number;
  studentsCount: number;
};

export type UserDBType = {
  _id: ObjectId;
  userName: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: Date;
};

export type ErrorResponse = {
  message: string;
};

export enum HttpStatuses {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  CREATED = 201,
  NO_CONTENT = 204,
}
