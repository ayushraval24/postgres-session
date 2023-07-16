import { Response, response } from "express";

export const DefaultResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data?: any,
  total?: number,
  page?: number
) => {
  let response: {} = {
    message: message,
    statusCode: statusCode,
    data: data,
  };

  if (total) {
    response = { ...response, total };
  }
  if (page) {
    response = { ...response, page };
  }

  return res.status(statusCode).json(response);
};

export const CookieResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data?: any,
  cookieData?: {
    name: string;
    data: string;
  }
) => {
  let response: {} = {
    message: message,
    statusCode: statusCode,
    data: data,
  };

  return res
    .status(statusCode)
    .cookie(cookieData?.name!, cookieData?.data)
    .json(response);
};
