import { asyncHandler } from "../../helpers/response/asynchandler";

export const addData = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
    }
  } catch (error) {}
});
