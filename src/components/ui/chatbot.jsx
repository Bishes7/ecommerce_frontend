import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import chatbotAvatar from "../../assets/avatar.png";
import "../../components/ChatBot.css";
import { useCreateMessageMutation } from "../../slices/messageApiSlice";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const ChatBot = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Namaste! Please contact use on (9808007257) or sanchezbibek9@gmail.com?",
    },
  ]);
  const [input, setInput] = useState("");

  const toggleChat = () => setIsOpen(!isOpen);

  const [createMessage, { isLoading, error }] = useCreateMessageMutation();

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);

    try {
      await createMessage({
        name: userInfo.name,
        email: userInfo.email,
        message: userMessage,
      }).unwrap();
      toast.success("Message sent successfully");
    } catch (err) {
      console.log(err?.data?.message);
    }
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
      {!isOpen && (
        <div className="chatbot-bubble-container">
          <button className="chatbot-button" onClick={toggleChat}>
            <img src={chatbotAvatar} alt="Chatbot" className="chatbot-avatar" />
          </button>
        </div>
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
            <button onClick={handleSend} disabled={isLoading}>
              {isLoading ? "Sending" : "Send"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
