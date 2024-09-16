import { Request } from "express";
import { ObjectId } from "mongoose";

// access token payload interface
export interface ITokenPayload {
    _id: ObjectId;
}

// interface to store user id in auth middleware
export interface IAuthRequest extends Request {
  _id: ObjectId;
}


export interface IQuery{
  author:ObjectId,
  status?:string 
}