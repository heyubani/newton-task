import User from "../models/user";
import * as Enums from "../libs/enum.status";
import jwt from "jsonwebtoken";

export const getUser =
  (type = "") =>
  async (req, res, next) => {
    try {
      const payload = req.body.username || req.decoded.username;
      const user = await User.findOne({ username: payload });
      if (!user && type === "login") {
        return res.status(Enums.HTTP_NOT_FOUND).json({
          status: "error",
          message: "Invalid username/password.",
        });
      }
      if (user && type === "validate") {
        return res.status(Enums.HTTP_BAD_REQUEST).json({
          status: "error",
          message: "decoded that user account already exists",
        });
      }
      req.user = user;
      return next();
    } catch (error) {
      console.error(
        `getting user details from the database failed::`,
        error.message
      );
      return next(error);
    }
  };

export const validateAuthToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(Enums.HTTP_UNAUTHORIZED).json({
        status: "error",
        message: "Please provide a token.",
      });
    }

    if (!token.startsWith("Bearer ")) {
      return res.status(Enums.HTTP_UNAUTHORIZED).json({
        status: "error",
        message: "Invalid/Expired Token.",
      });
    }

    const decoded = jwt.verify(token.slice(7), process.env.SECRET_KEY);

    if (decoded && decoded.username) {
      const user = await User.findOne({ username: decoded.username.trim() });

      if (!user) {
        return res.status(Enums.HTTP_UNAUTHORIZED).json({
          status: "error",
          message: "Invalid/Expired Token",
        });
      }

      req.user = user;
      return next();
    } else {
      throw new Error("Invalid token format.");
    }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(Enums.HTTP_UNAUTHORIZED).json({
        status: "error",
        message: "Session expired",
      });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(Enums.HTTP_UNAUTHORIZED).json({
        status: "error",
        message: "Invalid token.",
      });
    } else {
      return next(error);
    }
  }
};
