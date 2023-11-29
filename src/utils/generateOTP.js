const generateOTP = () => {
    const digits = "0123456789";
    return Array.from({ length: 6 }, () =>
      digits[Math.floor(Math.random() * 10)]
    ).join("");
  };
  
  module.exports = generateOTP;
  