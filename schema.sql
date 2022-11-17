CREATE TABLE "public"."Accounts" (
  id SERIAL,
  balance NUMERIC(15,2) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE "public"."Users" (
  id SERIAL,
  username varchar(30) NOT NULL,
  password varchar(120) NOT NULL,
  "accountId" INTEGER NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY ("accountId") REFERENCES "public"."Accounts" (id)
);

CREATE TABLE "public"."Transactions" (
  id SERIAL,
  "debitedAccountId" INTEGER NOT NULL,
  "creditedAccountId" INTEGER NOT NULL,
  value NUMERIC(15,2) NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY ("debitedAccountId") REFERENCES "public"."Users" (id),
  FOREIGN KEY ("creditedAccountId") REFERENCES "public"."Users" (id)
);