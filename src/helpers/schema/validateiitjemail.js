export const validateIITJEmail = (email) => {
  const iitjEmailRegex = /^[a-zA-Z0-9._-]+@iitj\.ac\.in$/;
  return iitjEmailRegex.test(email);
};

export const validateRollNumber = (rollNumber) => {
  const rollNumberRegex = /^[A-Z0-9]+$/;
  return rollNumberRegex.test(rollNumber);
};

export const validatePassword = (password) => {
  const minLength = 6;
  return password.length >= minLength;
};
