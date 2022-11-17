import prisma from "../client";
import { Request, Response } from "express";

interface CreateRequisition {
  username: string;
  password: string;
}

export default {
  async create(
    req: Request<{}, {}, CreateRequisition>,
    res: Response
  ): Promise<Response | undefined> {
    if (!req.body.password || !req.body.username) {
      return res.json({ status: false, message: "Complete all fields" });
    }
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
