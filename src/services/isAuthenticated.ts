import { Request, Response } from "express";
import jsonwebtoken from "jsonwebtoken";
import prisma from "../PrismaClient";

export default async function isAuthenticated(
  request: Request,
  response: Response
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
        message: "User doesn't exists. Invalid Token",
      });
    } else {
      return response.json({
        status: true,
      });
    }
  } catch (error) {
    console.log(error);
    return response.json({
      status: false,
      message: "Invalid token.",
    });
  }
}
