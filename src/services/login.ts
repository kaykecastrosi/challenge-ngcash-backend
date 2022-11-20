import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import prisma from "../PrismaClient";
import { Request, Response } from "express";
import { LoginRequisition } from "./types";

export default async function login(
  req: Request<{}, {}, LoginRequisition>,
  res: Response
): Promise<Response | undefined | void> {
  if (!req.body.password || !req.body.username) {
    return res.json({ status: false, message: "Complete all fields" });
  }

  const user = await prisma.users.findUnique({
    where: {
      username: req.body.username,
    },
  });

  if (!user) {
    return res.json({ status: false, message: "This user doesn't exists." });
  }

  const passwordEquals = await bcrypt.compare(req.body.password, user.password);

  if (!passwordEquals) {
    return res.json({ status: false, message: "The password is incorrect" });
  }

  const jwt = jsonwebtoken.sign(
    { user: user },
    process.env.PRIVATE_KEY as string,
    {
      expiresIn: "1d",
    }
  );

  return res.json({ status: true, jwt: jwt });
}
