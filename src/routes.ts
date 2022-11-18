import express from "express";
import UsersController from "./users/controller";

const routes = express.Router();

//Users
routes.post("/users", UsersController.create);

export default routes;
