import React, { useState } from "react";

function Chatbot() {

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {

    const response = await fetch("http://127.0.0.1:8000/chat/ai_chat/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: message })
    });

    const data = await response.json();

    setChat([...chat,
      { sender: "You", text: message },
      { sender: "AI", text: data.reply }
    ]);

    setMessage("");
  };

  return (
    <div>

      <h2>MEDI AI Assistant</h2>

      {/* Chat display area */}
      <div style={{
        height: "300px",
        overflow: "auto",
        border: "1px solid gray",
        backgroundColor: "black",
        color: "white",
        padding: "10px",
        marginBottom: "10px"
      }}>
        {chat.map((msg, index) => (
          <p key={index}>
            <b>{msg.sender}:</b> {msg.text}
          </p>
        ))}
      </div>

      {/* Input field */}
      <input
        style={{
          color: "black",
          padding: "8px",
          width: "70%",
          marginRight: "10px"
        }}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask health question..."
      />

      <button onClick={sendMessage}>Send</button>

    </div>
  );
}

export default Chatbot;