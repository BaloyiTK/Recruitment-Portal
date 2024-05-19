const logoutUser = async (res) => {
  res.clearCookie("token");
};

export default logoutUser;
