CREATE TABLE "public"."Accounts" (
  id int NOT NULL,
  balance NUMERIC(15,2),
  PRIMARY KEY (id)
);

CREATE TABLE "public"."Users" (
  id int NOT NULL,
  username varchar(30),
  password varchar(120),
  "accountId" INTEGER,
  PRIMARY KEY (id),
  CONSTRAINT account FOREIGN KEY ("accountId") REFERENCES "public"."Accounts" (id)
);

CREATE TABLE "public"."Transactions" (
  id int NOT NULL,
  "debitedAccountId" INTEGER,
  "creditedAccountId" INTEGER,
  "accountId" INTEGER,
  value NUMERIC(15,2),
  PRIMARY KEY (id),
  CONSTRAINT "debitedAccount" FOREIGN KEY ("debitedAccountId") REFERENCES "public"."Users" (id),
  CONSTRAINT "creditedAccount" FOREIGN KEY ("creditedAccountId") REFERENCES "public"."Users" (id)
);