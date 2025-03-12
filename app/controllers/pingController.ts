import { NextFunction, Request, Response } from "express";
import prisma from "../../prisma/client";
//todo: error handling
export async function pingJob(req: Request, res: Response, next: NextFunction) {
  try {
    const currentTime = new Date();
    const jobId = req.params.id;
    const {statusCode, duration} = req.body
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress 
    console.log("IP: ", ipAddress)
    console.log(req.headers)
    const ping = await prisma.ping.create({
      data: {
        jobId: +jobId,
        receivedAt: currentTime,
        statusCode,
        duration,
        ipAddress: ipAddress[0]
      },
    });
    await prisma.job.update({
      where: {
        id: +jobId,
      },
      data: {
        lastPing: currentTime,
        status: 'UP'
      },
    });
    return res.status(200).json({ data: ping });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "unknown error" });
  }
}

export async function getPings(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { skip, take } = req.body;
    const jobId = req.params.id;
    const data = prisma.ping.findMany({
      where: {
        jobId: +jobId,
      },
      skip: skip,
      take: take,
    });
    return res.status(200).json({data})
  } catch (error) {
    return res.status(500).json({error: "error fetching ping history"})
  }
}

