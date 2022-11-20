import prisma from "../PrismaClient";
import { Request, Response } from "express";
import { TransactionRequisition } from "./types";
import { Users, Prisma as PrismaClient } from "@prisma/client";

export default async function transaction(
  req: Request<{}, {}, TransactionRequisition>,
  res: Response
): Promise<Response | undefined | void> {
  const user: Users = JSON.parse(req.headers["user"] as string);

  if (!req.body.receiverUsername || !req.body.amount) {
    return res.json({ status: false, message: "Complete all fields" });
  }

  if (user.username == req.body.receiverUsername) {
    return res.json({
      status: false,
      message: "You can't realize a transaction with yourself.",
    });
  }

  const receiver = await prisma.users.findUnique({
    where: {
      username: req.body.receiverUsername,
    },
  });

  if (!receiver) {
    return res.json({
      status: false,
      message: "The receiver user doesn't exists.",
    });
  }

  const account = await prisma.accounts.findUnique({
    where: {
      id: user.accountId,
    },
  });

  if (!account) {
    return res.json({ status: false, message: "Account not found." });
  }

  if (account.balance < req.body.amount) {
    return res.json({
      status: false,
      message: "Your balance isn't enough to complete the transaction.",
    });
  }

  const donatorUpdate = await prisma.accounts.update({
    where: {
      id: user.accountId,
    },
    data: {
      balance: PrismaClient.Decimal.sub(account.balance, req.body.amount),
    },
  });

  const receiverUpdate = await prisma.accounts.update({
    where: {
      id: receiver.accountId,
    },
    data: {
      balance: {
        increment: req.body.amount,
      },
    },
  });

  const registrateTransaction = await prisma.transactions.create({
    data: {
      value: req.body.amount,
      creditedAccountId: receiver.accountId,
      debitedAccountId: user.accountId,
    },
  });

  return res.json({
    status: true,
    message: `Succesfuly transferred R$${req.body.amount} from ${user.username} to ${req.body.receiverUsername}`,
  });
}
