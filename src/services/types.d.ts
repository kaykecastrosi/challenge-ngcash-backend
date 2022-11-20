import { Decimal } from "@prisma/client/runtime";

export type LoginRequisition = {
  username: string;
  password: string;
};

export type TransactionRequisition = {
  amount: Decimal;
  receiverUsername: string;
};

export type TransactionHistoryFilters = {
  date: string;
  type: "debited" | "credited";
};
