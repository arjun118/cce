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

const allUsers = async (req, res) => {
  const users = await db.collection(USER_COLLECTION).find().toArray();
  return res.json({ users });
};

module.exports = { allUsers };
