const jwt = require("jsonwebtoken");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({
  path: path.resolve(__dirname + "/../.env"),
});
const { getClient } = require("../utils/db");
const db = getClient();
const { v4: uuid } = require("uuid");
const { USER_COLLECTION, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } =
  process.env;
const ExpressError = require("../utils/customErrorHandler");
const bcrypt = require("bcrypt");
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email | !password) {
    throw new ExpressError("Insufficient Details", 401);
  }
  const foundUser = await db
    .collection(USER_COLLECTION)
    .findOne({ email: email });
  if (!foundUser) {
    throw new ExpressError("No user found", 404);
  }
  const passwd = foundUser.password;
  const passwordMatch = await bcrypt.compare(password, passwd);
  if (passwordMatch) {
    const accessToken = jwt.sign(
      { userid: foundUser.userid },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "1hr" }
    );
    const refreshToken = jwt.sign(
      { userid: foundUser.userid },
      REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    await db.collection(USER_COLLECTION).updateOne(
      { email: email },
      {
        $set: { refreshToken: refreshToken },
      }
    );
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({ success: true, token: accessToken });
  } else {
    throw new ExpressError("Invalid credentials", 401);
  }
  // change the expiry time later
};

const signup = async (req, res) => {
  const { email, password } = req.body;
  if (!email | !password) {
    throw new ExpressError("Insufficient Details", 401);
  }
  const emailExists = await db
    .collection(USER_COLLECTION)
    .findOne({ email: email });
  if (emailExists) {
    throw new ExpressError("Email Already in use", 409);
  } else {
    const userid = uuid();
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.collection(USER_COLLECTION).insertOne({
      userid: userid,
      email: email,
      password: hashedPassword,
    });
    res.status(200).json({ success: true, message: "Signup Successfull" });
  }
};

const random = async (req, res) => {
  return res.json({ message: "wohoo secret one" });
};

const logout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.status(204).json({ success: true });
  }
  const refreshToken = cookies.jwt;
  const validUser = await db
    .collection(USER_COLLECTION)
    .findOne({ refreshToken: refreshToken });
  if (!validUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  }
  const userid = validUser.userid;
  await db.collection(USER_COLLECTION).updateOne(
    { userid: userid },
    {
      $unset: { refreshToken: "" },
    }
  );
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  return res.status(204).json({ success: true });
};
module.exports = { login, signup, random, logout };
