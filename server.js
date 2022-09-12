const express = require("express");
const app = express();
const server = require("http").createServer(app);
const cors = require("cors");
const io = require("socket.io")(server, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});

app.use(express.json({ limit: "10mb" }));
app.use(cors());

io.on("connection", (socket) => {
  console.log(`connect: ${socket.id}`);

  socket.on("hello!", () => {
    console.log(`hello from ${socket.id}`);
  });

  socket.on("disconnect", () => {
    console.log(`disconnect: ${socket.id}`);
  });
});

app.post("/post_data", (req, res) => {
  io.emit("message", req.body);
  res.send(200);
});

server.listen(3001);
