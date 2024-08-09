import { Schema, model } from "mongoose";
import { getCurrentIndianTime } from "../helpers/time/time.helper.js";
import { validateIITJEmail } from "../helpers/schema/validateiitjemail.js";
import {
  commonUniqueStringConstraintRequiresd,
  passwordRequiredConstraint,
} from "../helpers/schema/schema.helper.js";
import { hashPassword } from "../helpers/schema/passwordhash.js";

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validateIITJEmail,
      message: (props) => `${props.value} is not a valid IITJ email address!`,
    },
  },
  rollNumber: commonUniqueStringConstraintRequiresd,
  password: passwordRequiredConstraint,
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
