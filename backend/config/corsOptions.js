const allowedOrigins = require("./allowedOrigins");
const ExpressError = require("../utils/customErrorHandler");
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new ExpressError("Not allowed by CORS", 400));
    }
  },
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
