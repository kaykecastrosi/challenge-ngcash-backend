import express from "express";
import AuthMiddleware from "../src/middlewares/auth";
import UsersController from "./users/controller";
import login from "./services/login";
import transaction from "./services/transaction";

const routes = express.Router();

//Users
routes.post("/users", UsersController.create);
routes.get("/balance", AuthMiddleware, UsersController.balance);

//Services
routes.post("/login", login);
routes.put("/transaction", AuthMiddleware, transaction);

export default routes;
