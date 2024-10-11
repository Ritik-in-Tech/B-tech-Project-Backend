import { Schema, model } from "mongoose";
import { getCurrentIndianTime } from "../helpers/time/time.helper.js";
import {
  commonStringConstraints,
  commonUniqueStringConstraintRequiresd,
  passwordRequiredConstraint,
  uniqueEmailConstraint,
} from "../helpers/schema/schema.helper.js";
import { hashPassword } from "../helpers/schema/passwordhash.js";

const userSchema = new Schema({
  role: commonStringConstraints,
  email: uniqueEmailConstraint,
  rollNumber: commonUniqueStringConstraintRequiresd,
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
  date: {
    type: Date,
    default: getCurrentIndianTime(),
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
