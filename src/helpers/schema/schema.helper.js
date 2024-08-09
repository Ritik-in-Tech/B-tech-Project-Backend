import { Schema } from "mongoose";
import { getCurrentUTCTime } from "../time/time.helper.js";

export const contactNumberSchema = new Schema(
  {
    countryCode: {
      type: String,
      trim: true,
      default: "+91",
    },

    number: {
      type: String,
      trim: true,
      default: "",
      match: [
        /^\+?(\d{1,4})?[\s(-]?\(?(\d{3})\)?[-\s]?(\d{3})[-\s]?(\d{4})$/,
        "Please provide a valid phoneNumber",
      ],
    },
  },
  { _id: false }
);

export const commonStringConstraints = {
  type: String,
  trim: true,
  default: "",
};

export const commonNumberConstraints = {
  type: Number,
  default: 0,
};

export const commonDateConstraints = {
  type: Date,
  default: getCurrentUTCTime(),
};

export const commonStringConstraintsRequired = {
  type: String,
  trim: true,
  default: "",
};

export const commonUniqueStringConstraintRequiresd = {
  type: String,
  required: true,
  unique: true,
};

export const commonNumberConstraintsRequired = {
  type: Number,
  default: 0,
};

export const passwordRequiredConstraint = {
  type: String,
  required: true,
  minlength: 8,
  validate: {
    validator: function (v) {
      return v.length >= 8;
    },
    message: (props) =>
      `Password must be at least 8 characters long. Provided password is only ${props.value.length} characters long.`,
  },
};
