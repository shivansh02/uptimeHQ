import jwt from "jsonwebtoken";
import prisma from "../../prisma/client";
import bcrypt from "bcryptjs";
import { ErrorCode } from "../exceptions/root";
import { BadRequest } from "../exceptions/badRequest";
import { InternalException } from "../exceptions/internalException";
import { NotFoundException } from "../exceptions/notFound";

const JWT_SECRET = process.env.JWT_SECRET;

export const userRegister = async (req, res, next) => {
  const { email, password } = req.body;
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (existingUser) {
    throw new BadRequest("User already exists", ErrorCode.USER_ALREADY_EXISTS);
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });
  return res
    .status(200)
    .json({ success: true, message: "Resource created successfully" });
};

export const userLogin = async (req, res, next) => {
  const { email, password } = req.body;
  password;
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!existingUser) {
    throw new NotFoundException(
      "Requested user does not exist",
      null,
      ErrorCode.USER_NOT_FOUND
    );
  }
  const correctPassword = await bcrypt.compare(password, existingUser.password);
  if (!correctPassword) {
    throw new BadRequest("Wrong password!", ErrorCode.INCORRECT_PASSWORD);
  }
  const token = jwt.sign({ userId: existingUser.id }, JWT_SECRET, {
    expiresIn: "240h",
  });
  return res.status(200).json({ token });
};
