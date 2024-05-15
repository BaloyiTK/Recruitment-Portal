const validateFields = ( email, password) => {
    if ( !email || !password) {
      throw new Error("Please fill all the required fields!");
    }
  };
  
  export default validateFields;
  