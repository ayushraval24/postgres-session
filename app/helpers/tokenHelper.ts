import jwt from "jsonwebtoken";

export const generateAccessToken = (payload: any) => {
  // expires in works in seconds if given in number
  const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET_KEY!, {
    expiresIn: 60 * 60 * 60,
  });
  return token;
};

export const generateRefreshToken = (payload: any) => {
  const token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET_KEY!, {
    expiresIn: 60 * 60 * 60,
  });
  return token;
};

export const verifyAccessToken = (accessToken: string) => {
  const verified = jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET_KEY!
  );
  console.log("Verified: ", verified);
  return verified;
};

export const verifyRefreshToken = (refreshToken: string) => {
  const verified = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET_KEY!
  );
  return verified;
};
