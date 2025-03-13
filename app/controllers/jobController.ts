import { NextFunction, Request, Response } from "express";
import prisma from "../../prisma/client";

const DEPLOYMENT_URL = process.env.DEPLOYMENT_URL;

export async function createJob(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const {
    userId,
    name,
    cronSchedule,
    gracePeriod,
  }: {
    userId: string;
    name: string;
    cronSchedule: string;
    gracePeriod: number;
  } = req.body;
  const newJob = await prisma.job.create({
    data: {
      userId: +userId,
      name,
      cronSchedule,
      gracePeriod,
    },
  });
  await prisma.job.update({
    where: {
      id: newJob.id,
    },
    data: {
      url: `${DEPLOYMENT_URL}/ping/id`,
    },
  });
  return res.status(200).json({
    success: true,
    data: newJob,
    message: "Resource created successfully",
  });
}

export async function updateJob(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = req.params.id;
  const {
    name,
    cronSchedule,
    gracePeriod,
    url,
  }: {
    name: string;
    cronSchedule: string;
    gracePeriod: number;
    url: string;
  } = req.body;
  const newJob = await prisma.job.update({
    where: {
      id: +id,
    },
    data: {
      name,
      cronSchedule,
      gracePeriod,
      url,
    },
  });
  return res.status(200).json({
    success: true,
    data: newJob,
    message: "Resource created successfully",
  });
}

export async function getJob(req: Request, res: Response, next: NextFunction) {
  const jobId = req.params.id;
  let job = await prisma.job.findUnique({
    where: {
      id: +jobId,
    },
  });
  const uptimePercent =
    (job.pingCount / (job.pingCount + job.missedPingCount)) * 100;
  const jobWithUptime = { uptimePercent, ...job };
  return res.status(200).json({
    success: true,
    data: jobWithUptime,
    message: "Resource fetched successfully",
  });
}

export async function deleteJob(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = req.params.id;
  await prisma.alert.delete({
    where: {
      id: +id,
    },
  });

  return res.status(200).json({
    success: true,
    message: "Resource deleted successfully",
  });
}
