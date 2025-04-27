const express = require("express");
const morgan = require("morgan");
require("dotenv").config();
const cors = require("cors");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const errorHandler = require("./middlewares/errorHandler");
const port = process.env.PORT || 5000;
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
const createConnection = require("./dbConnection");
const userRouter = require("./Routes/userRoute");
createConnection();
app.use("/user", userRouter);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});
io.on("connection", (socket) => {
  console.log("a new user connected", socket.id);
  socket.on("message", (message) => {
    console.log("message", message);
    io.emit("message", message);
  });
  socket.on("disconnect", () => {
    console.log("user Disconnected");
  });
});

app.use(errorHandler);
server.listen(port, () => console.log("server is running at port " + port));
