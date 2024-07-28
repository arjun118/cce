const userRouter = require("express").Router();
const wrapAsync = require("../utils/asyncErrorHandler");
const { allUsers } = require("../controllers/userController");
const isAuthenticated = require("../middleware/isAuthenticated");

userRouter.get("/", isAuthenticated, wrapAsync(allUsers));

module.exports = userRouter;
