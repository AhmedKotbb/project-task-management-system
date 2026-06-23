import { Response } from 'express';
import moment from "moment"


export function responseHandler(
  res: Response,
  statusCode: number = 200,
  message: string,
  context?: any
) {

  const response = {
    statusCode,
    message,
    data: context || {},
    timestamp: moment().format('Y-M-D h:m:ss'),
  }

  res.status(statusCode).json(response)

}