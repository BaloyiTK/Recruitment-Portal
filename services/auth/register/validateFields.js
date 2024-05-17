const validateFields = (username, email, password) => {

    if (!username || !email || !password) {
      throw new Error("Please fill all the required fields!");
    }
  };
  
  export default validateFields;
  