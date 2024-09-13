import { DEBUG_MODE } from "../../config/envConfig";
import joi from "joi";

import CustomErrorHandler from "./customErrorHandler";
import {  Request, Response } from "express";
import { HttpError } from "http-errors";

// advanced error handler middleware
const errorHandler = (error: HttpError, req:Request, res:Response) => {
  let statusCode:number = 500;
  let data = {
    status: "error",
    message: "Internal server error",

    ...(DEBUG_MODE == "true" && { originalError: error.message }),
  };

  if (error instanceof joi.ValidationError) {
    console.log("console validation error here");
    statusCode = error?.statusCode || 422;
    data = {
      status: "error",
      message: error.message,
    };
  }

  if (error instanceof CustomErrorHandler) {
    statusCode = error.statusCode || 400;
    data = {
      status: "error",
      message: error.message,
    };
  }

  return res.status(statusCode).json(data);
};

export default errorHandler;
