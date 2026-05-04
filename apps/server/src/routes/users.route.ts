import { Router } from "express";
import { getUsers } from "../controllers/users.controller";

export const usersRouter = Router();

usersRouter.get("/", getUsers);
