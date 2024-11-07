import { Schema, model } from "mongoose";
import { getCurrentIndianTime } from "../helpers/time/time.helper.js";
import {
  commonStringConstraints,
  passwordRequiredConstraint,
  uniqueEmailConstraint,
} from "../helpers/schema/schema.helper.js";
import { hashPassword } from "../helpers/schema/passwordhash.js";

const userSchema = new Schema({
  role: commonStringConstraints,
  email: uniqueEmailConstraint,
  rollNumber: {
    type: String,
    required: function () {
      return this.role === "students";
    },
    unique: function () {
      return this.role === "students";
    },
  },
  password: passwordRequiredConstraint,
  fingerprintKey: {
    type: String,
  },
  fingerprintImageUrl: {
    type: String,
  },
  isProfileComplete: {
    type: Boolean,
    default: false,
  },
  rollHash: {
    type: String,
  },
  date: {
    type: Date,
    default: getCurrentIndianTime(),
  },
  qrLastGenerated: {
    type: Date,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await hashPassword(this.password);
    next();
  } catch (error) {
    next(error);
  }
});

const User = model("Users", userSchema);
export { User };
