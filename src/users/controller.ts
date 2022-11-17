import prisma from "../PrismaClient";
import { Request, Response } from "express";
import { CreateRequisition } from "./types";

export default {
  async create(
    req: Request<{}, {}, CreateRequisition>,
    res: Response
  ): Promise<Response | undefined | void> {
    if (!req.body.password || !req.body.username) {
      return res.json({ status: false, message: "Complete all fields" });
    }

    const userExists = await prisma.users.findUnique({
      where: {
        username: req.body.username,
      },
    });

    if (userExists) {
      return res.json({ status: false, message: "This user already exists" });
    }

    const createUser = await prisma.accounts.create({
      data: {
        balance: 100.6,
        Users: {
          create: {
            username: req.body.username,
            password: req.body.password,
          },
        },
      },
    });
    res.json(createUser);
  },
};
