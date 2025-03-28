import express from "express";
import authRouter from "./app/routes/auth";
import { verifyToken } from "./app/middleware/auth";
import { errorMiddleware } from "./app/middleware/errors";
import jobRouter from "./app/routes/job";
import pingRouter from "./app/routes/ping";
import { startMissedPingWorker } from "./jobs/missedPings";
import "./jobs/alert";
import cors from 'cors'
const app = express();

startMissedPingWorker().catch(console.error);
console.log("Started missed ping worker");

app.use(express.json()).use(cors());

app.use("/ping", pingRouter);
app.use("/auth", authRouter);

app.use(verifyToken);

app.use("/job", jobRouter);

app.use(errorMiddleware);

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
