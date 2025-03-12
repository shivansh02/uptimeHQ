import jwt from "jsonwebtoken";
import prisma from "../../prisma/client";
import bcrypt from "bcryptjs";
import { ErrorCode } from "../exceptions/root";
import { BadRequest } from "../exceptions/badRequest";

const JWT_SECRET = process.env.JWT_SECRET;

export const userRegister = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      return res
        .status(401)
        .json({ success: false, error: "User already exists" });
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
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, error: "User registration failed" });
  }
};

export const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    password;
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!existingUser) {
      return res.status(401).json({ success: false, error: "Invalid email" });
    }
    const correctPassword = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!correctPassword) {
      // return res
      //   .status(401)
      //   .json({ success: false, error: "Invalid password" });
     return next(new BadRequest('Wrong password!', ErrorCode.INCORRECT_PASSWORD));
    }
    const token = jwt.sign({ userId: existingUser.id }, JWT_SECRET, {
      expiresIn: "240h",
    });
    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Login failed" });
  }
};
