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

app.post("/post_normalize", (req, res) => {
  console.log("ssss");
  const data = require("./example_data/1_bangkok_hospital.json");

  const normal = data[0][0];

  const arrData = normal.cells;
  const chunkSize = normal.n_column;

  const dataChunk = [];
  for (let i = 0, l = arrData.length; i < l; i += chunkSize) {
    const chunk = arrData.slice(i, i + chunkSize);
    dataChunk.push(chunk);
  }

  const colHead = [
    "ITEM LIST",
    "ITEM NAME",
    "DESCRIPTION",
    "QUANTITY",
    "AMOUNT",
    "DISCOUNT",
    "NET AMOUNT",
    "NET PRICE",
    "TOTAL",
    "QTY",
    "NET.",
    "CHARGE AMOUNT",
  ];

  const colIndex = dataChunk.findIndex((row) =>
    row.find((cell) => colHead.includes(cell.text))
  );

  const colName = dataChunk[colIndex].map((cell) =>
    cell.text.replace(" ", "_").replace(".", "")
  );

  const dataRow = dataChunk.slice(colIndex + 1);

  const mapPropName = dataRow.map((row) =>
    row.map((cell, i) => ({
      [colName[i]]: cell.text,
      conficence: cell.confidence,
    }))
  );

  res.send({ data: mapPropName, colName });
});

app.get("/", (req, res) => {
  console.log("get");
  res.send(200);
});

server.listen(3001);
