import { NextFunction, Request, Response } from "express";
import prisma from "../../prisma/client";
import { NotFoundException } from "../exceptions/notFound";
import { ErrorCode } from "../exceptions/root";

export async function pingJob(req: Request, res: Response, next: NextFunction) {
  const currentTime = new Date();
  const jobId = req.params.id;
  const { statusCode, duration } = req.body;
  const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const job = await prisma.job.findUnique({
    where: {
      id: +jobId,
    },
  });
  if (!job) {
    return new NotFoundException(
      "Requested CronJob not found",
      null,
      ErrorCode.JOB_NOT_FOUND
    );
  }
  const ping = await prisma.ping.create({
    data: {
      jobId: +jobId,
      receivedAt: currentTime,
      statusCode,
      duration,
      ipAddress: ipAddress[0],
    },
  });
  await prisma.job.update({
    where: {
      id: +jobId,
    },
    data: {
      lastPing: currentTime,
      status: "UP",
      pingCount: {
        increment: 1,
      },
    },
  });
  return res.status(200).json({ data: ping });
}

export async function getPings(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { skip, take } = req.body;
  const jobId = req.params.id;
  const data = prisma.ping.findMany({
    where: {
      jobId: +jobId,
    },
    skip: skip,
    take: take,
  });
  return res.status(200).json({ data });
}
