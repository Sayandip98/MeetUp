// src/components/meeting/ChatPanel.jsx
import { useState } from "react";

const ChatPanel = ({ messages, onSend }) => {
  const [chatInput, setChatInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    onSend(chatInput);
    setChatInput("");
  };

  return (
    <div className="chat-panel">
      <h2>Chat</h2>
      <div className="chat-messages">
        {messages.map((m) => (
          <div key={m.id} className="chat-message">
            <strong>{m.sender.name}:</strong> {m.text}
          </div>
        ))}
      </div>
      <form className="chat-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatPanel;
