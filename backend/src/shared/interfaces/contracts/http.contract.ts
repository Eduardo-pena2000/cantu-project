import { NextFunction, Request } from "express";

import { UserEntity } from "../../../domain";

export interface HttpResponse {
  statusCode: number;
  body?: any;
  message: string;
}

export interface HttpRequest {
  body: any;
  params: any;
  query: any;
  user?: UserEntity;
  file?: any;
  files?: any;
}
export interface HttpNext {
  next: NextFunction;
}

export interface CustomRequest extends Request {
  user?: UserEntity;
}
