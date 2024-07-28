const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const { createServer } = require("http");
const server = createServer(app);
const { Server } = require("socket.io");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter.js");
const { connectTodb } = require("./utils/db");
const PORT = process.env.PORT || 3500;
const corsOptions = require("./config/corsOptions");
const credentials = require("./middleware/credentials");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRouter);
app.use("/users", userRouter);
// testing purposes

io.on("connection", (socket) => {
  console.log("a user is connected");
  socket.on("from_client", (data) => {
    socket.broadcast.emit("some_user", data);
  });

  socket.on("change_language", (data) => {
    socket.broadcast.emit("set_language", data);
  });
});

app.use((err, req, res, next) => {
  let { status = 500 } = err;
  let { message = "Internal server error" } = err;
  //handle different types of erros
  console.log(err);
  return res.status(status).json({ message, success: false });
});

connectTodb().then(() => {
  console.log("connected to db");
  server.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
  });
});
