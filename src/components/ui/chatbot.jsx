import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import chatbotAvatar from "../../assets/avatar.png";
import "../../components/ChatBot.css";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Namaste! How may I help you?" },
  ]);
  const [input, setInput] = useState("");

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    setMessages([...messages, { sender: "user", text: input }]);
    setInput("");

    // Simulate bot reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Thank you! We'll get back to you soon." },
      ]);
    }, 1000);
  };

  return (
    <div className="chatbot-container">
      {/* Floating avatar button */}
      {!isOpen && (
        <button className="chatbot-button" onClick={toggleChat}>
          <img src={chatbotAvatar} alt="Chatbot" className="chatbot-avatar" />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <span>Support</span>
            <button onClick={toggleChat} className="close-btn">
              <FaTimes size={18} />
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`message ${msg.sender === "user" ? "user" : "bot"}`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
