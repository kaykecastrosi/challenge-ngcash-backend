import express from "express";
import UsersController from "./controllers/UsersController";

const routes = express.Router();

//Frete
routes.put("/users", UsersController.create);

export default routes;
