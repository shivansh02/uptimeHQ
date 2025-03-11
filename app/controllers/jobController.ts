import { NextFunction, Request, Response } from "express";
import prisma from "../../prisma/client";

// todo:
// error handling

const DEPLOYMENT_URL = process.env.DEPLOYMENT_URL;

export async function createJob(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    console.log("creating job");
    const {
      userId,
      name,
      interval,
      gracePeriod,
    }: {
      userId: string;
      name: string;
      interval: number;
      gracePeriod: number;
    } = req.body;
    const newJob = await prisma.job.create({
      data: {
        userId: +userId,
        name,
        interval,
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
  } catch (error) {
    // throw error using middleware
    console.log(error);
    return res.status(500).json({ error: "unknown error" });
  }
}
// {
//   "userId": 1,
//   "name": "cronjob#1",
//   "interval": 30,
//   "gracePeriod": 5,
//   "url": "http://localhost:8080/ping/1"
// }


export async function updateJob(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id;
    const {
      userId,
      name,
      interval,
      gracePeriod,
      url,
    }: {
      userId: string;
      name: string;
      interval: number;
      gracePeriod: number;
      url: string;
    } = req.body;
    const newJob = await prisma.job.update({
      where: {
        id: +id,
      },
      data: {
        userId: +userId,
        name,
        interval,
        gracePeriod,
        url,
      },
    });
    return res.status(200).json({
      success: true,
      data: newJob,
      message: "Resource created successfully",
    });
  } catch (error) {
    // throw error using middleware
    console.log(error);
    return res.status(500).json({ error: "unknown error" });
  }
}
