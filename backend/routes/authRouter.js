const authRouter = require("express").Router();
const wrapAsync = require("../utils/asyncErrorHandler.js");
const isLoggedin = require("../middleware/isAuthenticated.js");
const {
  login,
  signup,
  random,
  logout,
} = require("../controllers/authController.js");
const handleRefreshToken = require("../controllers/refreshTokenController.js");
authRouter.post("/login", wrapAsync(login));
authRouter.post("/signup", wrapAsync(signup));
authRouter.get("/random", isLoggedin, wrapAsync(random));
authRouter.get("/refresh", wrapAsync(handleRefreshToken));
authRouter.get("/logout", wrapAsync(logout));
module.exports = authRouter;
