import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import io from "socket.io-client";
import { get } from "lodash";

const socket = io("13.212.2.2:3001");

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

  console.log(lastMessage);

  const displayData = JSON.stringify(lastMessage || "", null, 4);

  return (
    <div className="App">
      <header className="App-header">
        <p>API Connected: {"" + isConnected}</p>
        <div style={{ textAlign: "left" }}>
          <pre>
            <code>{displayData || "-"}</code>
          </pre>
        </div>
        <>
          {get(lastMessage, "image1", "") && (
            <div style={{ display: "flex", flexDirection: "row", gap: 20 }}>
              <img
                alt="image1"
                width="300"
                src={
                  get(lastMessage, "image1", "")
                    ? `data:image/png;base64,${lastMessage.image1}`
                    : logo
                }
              />
              <img
                alt="image1"
                width="300"
                src={
                  get(lastMessage, "image2", "")
                    ? `data:image/png;base64,${lastMessage.image2}`
                    : logo
                }
              />
            </div>
          )}
        </>

        {/* <button onClick={ sendMessage }>Say hello!</button> */}
      </header>
    </div>
  );
}

export default App;
