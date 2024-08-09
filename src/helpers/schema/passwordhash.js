import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (candidatePassword, storedPassword) => {
  return bcrypt.compare(candidatePassword, storedPassword);
};
