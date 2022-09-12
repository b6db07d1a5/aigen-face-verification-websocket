import React, { useState, useEffect } from "react";
import "./App.css";
import io from "socket.io-client";

const socket = io("localhost:3001");

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastMessage, setLastMessage] = useState(null);

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
    });
    socket.on("disconnect", () => {
      setIsConnected(false);
    });
    socket.on("message", (data) => {
      console.log(data);
      setLastMessage(data);
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("message");
    };
  }, []);

  // const sendMessage = () => {
  //   socket.emit('hello!');
  // }

  return (
    <div className="App">
      <header className="App-header">
        <p>API Connected: {"" + isConnected}</p>
        <div style={{ textAlign: "left" }}>
          <pre>
            <code>{lastMessage.data || "-"}</code>
          </pre>
        </div>
        <div style={{ display: "flex", flexDirection: "row", gap: 20 }}>
          <img
            alt="image1"
            width="300"
            src={`data:image/png;base64,${lastMessage.image1}`}
          />
          <img
            alt="image1"
            width="300"
            src={`data:image/png;base64,${lastMessage.image2}`}
          />
        </div>
        {/* <button onClick={ sendMessage }>Say hello!</button> */}
      </header>
    </div>
  );
}

export default App;
