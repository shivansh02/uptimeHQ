import express from "express";
import { getPings, pingJob } from "../controllers/pingController";
import { errorHandler } from "../../errorHandler";

const pingRouter = express.Router();

pingRouter.post("/:id", errorHandler(pingJob));
pingRouter.get("/:id", errorHandler(getPings));

export default pingRouter;
