const validateFields = (username, email,accountType, password) => {

    if (!username || !email || !password || !accountType) {
      throw new Error("Please fill all the required fields!");
    }
  };
  
  export default validateFields;
  