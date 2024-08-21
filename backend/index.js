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
  socket.on("set_code_client", (data) => {
    console.log("set code from client is received");
    const { message, roomid } = data;
    console.log(data);
    // socket.broadcast.emit("set_code_server", data);
    io.to(roomid).emit("set_code_server", message);
  });

  socket.on("change_language_client", (data) => {
    const { message, roomid } = data;
    // socket.broadcast.emit("set_language", data);
    io.to(roomid).emit("change_language_server", message);
  });

  socket.on("create_new_room", (data) => {
    console.log("roomid new one:", data);
    socket.join(data); // user joined this room
  });

  socket.on("join_existing_room", (data) => {
    if (!socket.rooms.has(data)) {
      console.log("roomid join one:", data);
      socket.join(data); //join the existing room
      socket.to(data).emit("new user joined");
    }
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
