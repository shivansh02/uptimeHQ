import express from "express";
import { errorHandler } from "../../errorHandler";
import { createAlert, deleteAlert, updateAlert } from "../controllers/alertController";

const alertRouter = express.Router();

alertRouter.post("/create", errorHandler(createAlert));
alertRouter.get("/:id", errorHandler(updateAlert));
alertRouter.delete("/:id", errorHandler(deleteAlert));

export default alertRouter;
