import express from "express";
import authRouter from "./app/routes/auth";
import { verifyToken } from "./app/middleware/auth";
import { errorMiddleware } from "./app/middleware/errors";
import jobRouter from "./app/routes/job";
import pingRouter from "./app/routes/ping";
import { startMissedPingWorker } from "./jobs/missedPings";
import "./jobs/alert"

const app = express();

startMissedPingWorker().catch(console.error);
console.log("Started missed ping worker");

app.use(express.json());

app.use("/auth", authRouter);
app.use("/job", jobRouter);
app.use("/ping", pingRouter);

// app.get("/ping", (req, res) => {
//   res.send("pong");
// });

app.use(verifyToken);

// app.use(errorMiddleware);

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
