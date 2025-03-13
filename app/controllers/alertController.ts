import { NextFunction, Request, Response } from "express";
import prisma from "../../prisma/client";

export async function createAlert(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { jobId, type, destination } = req.body;
  const newAlert = await prisma.alert.create({
    data: {
      jobId,
      type,
      destination,
    },
  });
  return res.status(200).json({
    success: true,
    data: newAlert,
    message: "Resource created successfully",
  });
}

export async function deleteAlert(
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

export async function updateAlert(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  const { jobId, type, destination } = req.body;

  const updatedAlert = await prisma.alert.update({
    where: { id: +id },
    data: { jobId, type, destination },
  });

  return res.status(200).json({
    success: true,
    data: updatedAlert,
    message: "Resource updated successfully",
  });
}
