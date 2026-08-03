const isValidEmail = (email) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email.trim());
};

const validateRegistration = ({ fullName, email, password } = {}) => {
  if (
    typeof fullName !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return "Invalid request data.";
  }
  const trimmedFullName = fullName.trim();
  if (
    trimmedFullName.length < 3 ||
    trimmedFullName.length > 60
  ) {
    return "Full name must contain between 3 and 60 characters.";
  }
  if (!isValidEmail(email)) {
    return "Please provide a valid email address.";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters long.";
  }
  return null;
};

const validateLogin = ({ email, password } = {}) => {
  if (
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return "Invalid request data.";
  }
  if (!isValidEmail(email)) {
    return "Please provide a valid email address.";
  }
  if (!password) {
    return "Password is required.";
  }
  return null;
};

module.exports = {validateRegistration,validateLogin,};