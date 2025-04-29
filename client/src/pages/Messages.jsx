import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Messages = () => {
  const { user } = useContext(AuthContext);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [error, setError] = useState("");

  const contacts = [
    {
      id: 1,
      username: "@cryptoqueen",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      lastMessage: "Hey, check out my new NFT!",
    },
    {
      id: 2,
      username: "@beatsmith",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      lastMessage: "Dropping a new track soon!",
    },
  ];

  useEffect(() => {
    if (!user) return;

    const socketInstance = io("http://localhost:5000", {
      auth: { token: localStorage.getItem("token") },
    });
    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("Socket connected");
      setError("");
    });

    socketInstance.on("disconnect", (reason) => {
      console.log(`Socket disconnected: ${reason}`);
      setError("Disconnected from chat. Attempting to reconnect...");
    });

    socketInstance.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
      setError("Failed to connect to chat. Please try again later.");
    });

    socketInstance.on("message", ({ from, text, timestamp }) => {
      const normalizedFrom = from.startsWith("@") ? from : `@${from}`; // Normalize username
      setMessages((prev) => ({
        ...prev,
        [normalizedFrom]: [
          ...(prev[normalizedFrom] || []),
          { text, sender: normalizedFrom, timestamp },
        ],
      }));
    });

    return () => {
      socketInstance.off("connect");
      socketInstance.off("disconnect");
      socketInstance.off("connect_error");
      socketInstance.off("message");
      socketInstance.disconnect();
    };
  }, [user]);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedContact || !socket || !user) return;

    const timestamp = new Date().toISOString();
    const messageData = {
      to: selectedContact.username,
      from: user.username,
      text: newMessage,
      timestamp,
    };

    socket.emit("message", messageData);
    // Optimistically update UI
    setMessages((prev) => ({
      ...prev,
      [selectedContact.username]: [
        ...(prev[selectedContact.username] || []),
        { text: newMessage, sender: "me", timestamp },
      ],
    }));
    setNewMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">💬 Messages</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="flex h-[calc(100vh-12rem)] bg-white rounded-xl shadow-md overflow-hidden">
        <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className={`p-4 cursor-pointer flex items-center hover:bg-gray-100 ${
                selectedContact?.id === contact.id ? "bg-gray-100" : ""
              }`}
              onClick={() => setSelectedContact(contact)}
            >
              <img
                src={contact.avatar}
                alt={contact.username}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <h3 className="font-medium">{contact.username}</h3>
                <p className="text-sm text-gray-500 truncate">
                  {contact.lastMessage}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="w-2/3 flex flex-col">
          {selectedContact ? (
            <>
              <div className="p-4 border-b border-gray-200 flex items-center">
                <img
                  src={selectedContact.avatar}
                  alt={selectedContact.username}
                  className="w-8 h-8 rounded-full mr-3"
                />
                <h3 className="font-semibold">{selectedContact.username}</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {(messages[selectedContact.username] || []).map(
                  (msg, index) => (
                    <div
                      key={index}
                      className={`max-w-[70%] p-3 rounded-xl m-2 ${
                        msg.sender === "me"
                          ? "bg-gradient-to-r from-vibe-pink to-vibe-orange text-white ml-auto rounded-br-none"
                          : "bg-gray-200 text-gray-900 mr-auto rounded-bl-none"
                      }`}
                    >
                      <p>{msg.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  )
                )}
              </div>
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-vibe-pink resize-none"
                    rows="2"
                  />
                  <button
                    onClick={sendMessage}
                    className="ml-2 px-4 py-2 bg-gradient-to-r from-vibe-pink to-vibe-orange text-white rounded-lg hover:from-pink-600 hover:to-orange-600"
                  >
                    <FontAwesomeIcon icon={faPaperPlane} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500">
                Select a contact to start chatting
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
