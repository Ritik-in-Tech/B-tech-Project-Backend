import { Schema, model } from "mongoose";
import { commonStringConstraints } from "../helpers/schema/schema.helper.js";
import { getCurrentIndianTime } from "../helpers/time/time.helper.js";

const dataSchema = new Schema(
  {
    type: commonStringConstraints,
    isDone: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const messSchema = new Schema({
  mess: commonStringConstraints,
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  startDate: {
    type: Date,
    default: getCurrentIndianTime(),
  },
  endDate: {
    type: Date,
    default: getCurrentIndianTime(),
  },
  data: {
    type: Map,
    of: [dataSchema],
    default: {},
  },
});

const Mess = model("mess", messSchema);
export { Mess };
