const isValidEmail = (email) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email.trim());
};

const validateRegistration = ({ fullName, email, password }) => {
  if (!fullName || fullName.trim().length < 3) {
    return "Full name must contain at least 3 characters.";
  }
  if (!email || !isValidEmail(email)) {
    return "Please provide a valid email address.";
  }
  if (!password || password.length < 8) {
    return "Password must be at least 8 characters long.";
  }
  return null;
};

const validateLogin = ({ email, password }) => {
  if (!email || !isValidEmail(email)) {
    return "Please provide a valid email address.";
  }
  if (!password) {
    return "Password is required.";
  }
  return null;
};

module.exports = {validateRegistration,validateLogin,};