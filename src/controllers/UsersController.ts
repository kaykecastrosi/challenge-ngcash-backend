import prisma from "../client";
import { Request, Response } from "express";

interface CreateRequistion {
  username: string;
  password: string;
}

export default {
  async create(
    req: Request<{}, {}, CreateRequistion>,
    res: Response
  ): Promise<void> {
    const createUser = await prisma.accounts.create({
      data: {
        balance: 100.0,
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
