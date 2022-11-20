import express from "express";
import AuthMiddleware from "../src/middlewares/auth";
import UsersController from "./users/controller";
import login from "./services/login";

const routes = express.Router();

//Users
routes.post("/users", UsersController.create);
routes.get("/balance", AuthMiddleware, UsersController.balance);

//Services
routes.post("/login", login);

export default routes;
