const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 4000 });
// สร้าง websockets server ที่ port 4000
wss.on("connection", function connection(ws) {
  // สร้าง connection
  ws.on("message", function incoming(message) {
    // รอรับ data อะไรก็ตาม ที่มาจาก client แบบตลอดเวลา
    console.log("received: %s", message);
  });
  ws.on("close", function close() {
    // จะทำงานเมื่อปิด Connection ในตัวอย่างคือ ปิด Browser
    console.log("disconnected");
  });
  ws.send("init message to client");
  // ส่ง data ไปที่ client เชื่อมกับ websocket server นี้
  setInterval(() => {
    const data = {
      posX: Math.floor(Math.random() * 800 + 1),
      posY: Math.floor(Math.random() * 600 + 1),
    };
    console.log("sending to data to client:", data);
    ws.send(JSON.stringify(data));
  }, 1000);
});
