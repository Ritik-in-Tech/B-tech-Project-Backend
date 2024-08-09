export const validateIITJEmail = (email) => {
  const iitjEmailRegex = /^[a-zA-Z0-9._-]+@iitj\.ac\.in$/;
  return iitjEmailRegex.test(email);
};
