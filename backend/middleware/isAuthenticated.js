const path = require("path");
const dotenv = require("dotenv");
dotenv.config({
  path: path.resolve(__dirname + "/../.env"),
});
const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN_SECRET } = process.env;
const isLoggedin = async (req, res, next) => {
  let token = req.headers.authorization;
  try {
    if (token) {
      token = token.split(" ")[1];
      const user = jwt.verify(token, ACCESS_TOKEN_SECRET);
      req.userid = user.userid;
      next();
    } else {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized Action" });
    }
  } catch (error) {
    return res
      .status(403)
      .json({ success: false, message: "Unauthorized Action" });
  }
};

module.exports = isLoggedin;
