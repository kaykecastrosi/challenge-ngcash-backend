import bcrypt from "bcrypt";
import prisma from "../PrismaClient";
import { Users } from "@prisma/client";
import { Request, Response } from "express";
import { CreateRequisition } from "./types";

const passwordRegex = (password: string): boolean => {
  return (
    password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)
  );
};

export default {
  async create(
    req: Request<{}, {}, CreateRequisition>,
    res: Response
  ): Promise<Response | undefined | void> {
    if (!req.body.password || !req.body.username) {
      return res.json({ status: false, message: "Complete all fields" });
    }

    if (req.body.username.length < 3) {
      return res.json({
        status: false,
        message: "The username must have more than 3 letters",
      });
    }

    if (!passwordRegex(req.body.password)) {
      return res.json({
        status: false,
        message:
          "The password must have at least eight characters, one uppercase letter and one number",
      });
    }

    const userExists = await prisma.users.findUnique({
      where: {
        username: req.body.username,
      },
    });

    if (userExists) {
      return res.json({ status: false, message: "This user already exists" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const createUser = await prisma.accounts.create({
      data: {
        balance: 100,
        Users: {
          create: {
            username: req.body.username,
            password: hashedPassword,
          },
        },
      },
    });
    res.json(createUser);
  },
  async balance(
    req: Request,
    res: Response
  ): Promise<Response | undefined | void> {
    const user: Users = JSON.parse(req.headers["user"] as string);

    const account = await prisma.accounts.findUnique({
      where: {
        id: user.accountId,
      },
    });

    if (!account) {
      return res.json({ status: false, message: "Account not found." });
    }

    return res.json({ status: true, balance: account.balance });
  },
};
