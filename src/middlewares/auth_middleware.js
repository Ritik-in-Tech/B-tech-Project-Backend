import { ApiResponse } from "../helpers/response/apiresponse.js";
import { asyncHandler } from "../helpers/response/asynchandler.js";
import jwt from "jsonwebtoken";

export const verifyJwt = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accesstoken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json(new ApiResponse(401, {}, "Token is required"));
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (
      !decodedToken ||
      !decodedToken?.userDetails ||
      !decodedToken?.userDetails._id ||
      !decodedToken?.userDetails.role
    ) {
      return res.status(403).json(new ApiResponse(403, {}, "Invalid token"));
    }

    req.user = decodedToken?.userDetails;
    req.userDetails = decodedToken?.userDetails;
    next();
  } catch (error) {
    // console.error("Error verifying JWT:", error);

    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json(new ApiResponse(401, {}, "Token has expired"));
    }

    // Handle other errors
    return res
      .status(500)
      .json(
        new ApiResponse(500, {}, "An error occurred while verifying token")
      );
  }
});
