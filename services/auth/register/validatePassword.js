const validatePassword = (password) => {
    const mixCharsRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?/\\~-]).{8,}$/;
    if (!mixCharsRegex.test(password)) {
      throw new Error( "The password must be at least 8 characters long and contain at least one uppercase letter (A-Z), one lowercase letter (a-z), one numeric digit (0-9), and one special character (!@#$%^&*()_+{}[]:;<>,.?/\\~-).",);
    }
  };
  
  export default validatePassword;
  