const jwt = require("jsonwebtoken");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({
  path: path.resolve(__dirname + "/../.env"),
});
const { getClient } = require("../utils/db");
const db = getClient();
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, USER_COLLECTION } =
  process.env;
const handleRefreshToken = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies.jwt) {
      return res
        .status(401)
        .json({ succes: false, message: "Please Login again" });
    }
    const refreshToken = cookies.jwt;
    const validUser = await db
      .collection(USER_COLLECTION)
      .findOne({ refreshToken: refreshToken });
    if (!validUser) {
      return res.status(403).json({ message: "Forbidden", success: false });
    }
    const user = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    const accessToken = jwt.sign(
      {
        userid: validUser.userid,
      },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "10h" }
    );
    return res.json({ success: true, token: accessToken });
  } catch (e) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized Action, Try logging in again",
    });
  }
};

module.exports = handleRefreshToken;
