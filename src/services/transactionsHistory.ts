import prisma from "../PrismaClient";
import { Request, Response } from "express";
import moment from "moment";
import { TransactionHistoryFilters } from "./types";
import { Users } from "@prisma/client";

export default async function transactionsHistory(
  req: Request<{}, {}, TransactionHistoryFilters>,
  res: Response
): Promise<Response | undefined | void> {
  const user: Users = JSON.parse(req.headers["user"] as string);

  const date = moment(req.body.date, "DD-MM-YYYY");

  const validType = (): boolean =>
    req.body.type == "credited" || req.body.type == "debited";

  if (req.body.date) {
    if (!date.isValid()) {
      return res.json({ status: false, message: "Insert a valid date" });
    }
  }

  if (req.body.type) {
    if (!validType()) {
      return res.json({ status: false, message: "Insert a valid type" });
    }
  }
  if (req.body.date && req.body.type) {
    if (req.body.type == "credited") {
      const transactionsHistory = await prisma.transactions.findMany({
        where: {
          creditedAccountId: user.accountId,
          createdAt: {
            gte: date.toISOString(),
            lt: date.add(1, "day").toISOString(),
          },
        },
        include: {
          creditedAccount: true,
          debitedAccount: true,
        },
      });
      return res.json({ status: true, transactions: transactionsHistory });
    }
    if (req.body.type == "debited") {
      const transactionsHistory = await prisma.transactions.findMany({
        where: {
          debitedAccountId: user.accountId,
          createdAt: {
            gte: date.toISOString(),
            lt: date.add(1, "day").toISOString(),
          },
        },
        include: {
          creditedAccount: true,
          debitedAccount: true,
        },
      });
      return res.json({ status: true, transactions: transactionsHistory });
    }
  }

  if (req.body.date) {
    const transactionsHistory = await prisma.transactions.findMany({
      where: {
        OR: [
          { creditedAccountId: user.accountId },
          { debitedAccountId: user.accountId },
        ],
        createdAt: {
          gte: date.toISOString(),
          lt: date.add(1, "day").toISOString(),
        },
      },
      include: {
        creditedAccount: true,
        debitedAccount: true,
      },
    });
    return res.json({
      status: true,
      transactions: transactionsHistory,
      here: "here",
    });
  }

  if (req.body.type) {
    if (req.body.type == "credited") {
      const transactionsHistory = await prisma.transactions.findMany({
        where: {
          creditedAccountId: user.accountId,
        },
        include: {
          creditedAccount: true,
          debitedAccount: true,
        },
      });
      return res.json({ status: true, transactions: transactionsHistory });
    }
    if (req.body.type == "debited") {
      const transactionsHistory = await prisma.transactions.findMany({
        where: {
          debitedAccountId: user.accountId,
        },
        include: {
          creditedAccount: true,
          debitedAccount: true,
        },
      });
      return res.json({ status: true, transactions: transactionsHistory });
    }
  }

  const transactionsHistory = await prisma.transactions.findMany({
    where: {
      OR: [
        { creditedAccountId: user.accountId },
        { debitedAccountId: user.accountId },
      ],
    },
    include: {
      creditedAccount: true,
      debitedAccount: true,
    },
  });

  return res.json({ status: true, transactions: transactionsHistory });
}
