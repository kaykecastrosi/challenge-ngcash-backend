import { Request, Response, NextFunction } from "express";
import jsonwebtoken, { Secret } from "jsonwebtoken";
import prisma from "../PrismaClient";

export default async function validateToken(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const token = request.headers.authorization?.split(" ")[1];

  if (!token)
    return response.json({
      status: false,
      message: "Access denied. No token provided.",
    });

  try {
    const payload = jsonwebtoken.verify(
      token,
      process.env.PRIVATE_KEY as string
    );
    const userId = typeof payload !== "string" && payload.user?.id;

    const userExists = await prisma.users.findUnique({
      where: {
        id: userId,
      },
    });

    if (!userExists) {
      return response.json({
        status: false,
        message: "User doesnt exists. Invalid Token",
      });
    } else {
      request.headers["user"] = JSON.stringify(userExists);
      return next();
    }
  } catch (error) {
    console.log(error);
    return response.json({
      status: false,
      message: "Invalid token.",
    });
  }
}
