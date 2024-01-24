export const validateEmail = emailId => {
  if (!emailId) {
    return false;
  }

  return /\S+@\S+\.\S+/.test(emailId);
};
