import express from "express";
import AuthMiddleware from "../src/middlewares/auth";
import UsersController from "./users/controller";

const routes = express.Router();

//Users
routes.post("/users", UsersController.create);

export default routes;
