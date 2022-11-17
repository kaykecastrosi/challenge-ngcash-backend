import express from "express";
import UsersController from "./users/controller";

const routes = express.Router();

//Frete
routes.put("/users", UsersController.create);

export default routes;
