const setAuthCookie = (res, token) => {
    const tokenExpires = new Date(Date.now() + 1000 * 60 * 60 * 6);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      expires: tokenExpires,
      path: "/",
      sameSite: "none",
    });
  };
  
  export default setAuthCookie;
  