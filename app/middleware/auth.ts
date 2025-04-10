import jwt from "jsonwebtoken";

export async function verifyToken(req, res, next) {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return res.status(401).json({ success: false, error: "Access denied" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded: ", decoded)
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ success: false, error: "Unknown middleware error" });
  }
}
