import { NextFunction, Request, Response } from "express";
import prisma from "../../prisma/client";
//todo: responseTime, error handling
export async function pingJob(req: Request, res: Response, next: NextFunction) {
  try {
    const jobId = req.params.id;
    const { statusCode } = req.body;
    const ping = await prisma.ping.create({
      data: {
        jobId: +jobId,
        receivedAt: new Date(),
        responseTime: 0,
        statusCode,
      },
    });
    await prisma.job.update({
      where: {
        id: +jobId
      },
      data: {
        lastPing: new Date()
      }
    })
    return res.status(200).json({data: ping})
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "unknown error" });
  }
}
