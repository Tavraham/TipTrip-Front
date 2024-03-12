import axios from "axios";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { getUsersRoute, host } from "@/utils/apiRoutes";

const Chat = () => {
  const [socket, setSocket] = useState<any>(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [room, setRoom] = useState("");

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      if (socket) {
        socket.disconnect();
      }

      const newSocket = io(host);

      newSocket.emit(
        "join-room",
        selectedUser.name,
        localStorage.getItem("name")
      );

      newSocket.on("roomCreated", (roomId: string) => {
        console.log(`Joined room: ${roomId}`);
        setRoom(roomId);
        setSocket(newSocket);
      });
    }
  }, [selectedUser]);

  useEffect(() => {
    if (socket) {
      socket.on("chat-history", (messagesData: any) => {
        if (Array.isArray(messagesData)) {
          const formattedMessages = messagesData.map((messageData) => {
            return `${messageData.sender}: ${messageData.message}`;
          });
          setMessages(formattedMessages);
        } else {
          console.error("Invalid data format for chat messages:", messagesData);
        }
      });

      socket.on("new-message", (messageData: any) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          `${messageData.from}: ${messageData.msg}`,
        ]);
      });
    }
  }, [socket]);

  async function getAllUsers() {
    try {
      const res = await axios.get(getUsersRoute, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const filteredUsers = res.data.filter(
        (user: any) => user.name !== localStorage.getItem("name")
      );
      setUsers(filteredUsers);
    } catch (error) {
      console.error(error);
    }
  }

  function openChat(user: any) {
    // Check if the selected user is already the current user, return if so
    if (selectedUser && selectedUser._id === user._id) return;

    // Set the selected user
    setSelectedUser(user);
  }

  function sendMessage() {
    if (messageInput && socket) {
      socket.emit("send-message", {
        to: room,
        from: localStorage.getItem("name"),
        msg: messageInput,
      });
      setMessageInput(""); // Clear the input field after sending message
    }
  }

  return (
    <div className="flex">
      <div className="user-container w-1/4 p-4 border-r">
        <h2 className="h3-bold md:h2-bold text-left w-full">Users:</h2>
        <ul>
          {users.map((user: any) => (
            <li key={user.name} className="mb-2 flex items-center">
              <img
                src={
                  !user.photo
                    ? "/assets/icons/profile-placeholder.svg"
                    : `${host}/${user.photo}`
                }
                alt="profilePic" 
                className="w-11 h-11 rounded-full mr-2" />
              {selectedUser && selectedUser._id === user._id ? (
                <button className="bg-primary-500 py-1 px-2 rounded text-xl">{user.name}</button>
              ) : (
                <button className="bg-primary-500 hover:bg-gray-200 py-1 px-2 rounded text-black text-sm" onClick={() => openChat(user)}>
                  {user.name}
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 p-4">
        {selectedUser && (
          <>
            <h2 className="text-xl font-bold mb-4">Chat with {selectedUser.name}</h2>
            <div className="h-96 overflow-y-auto mb-4">
              <ul>
                {messages.map((message, index) => (
                  <li key={index}>{message}</li>
                ))}
              </ul>
            </div>
            <div className="flex">
              <input
                type="text"
                placeholder="Type your message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                style={{ color: "black" }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
                className="flex-1 py-2 px-4 rounded-l border border-gray-300 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={sendMessage}
                className="py-2 px-4 bg-blue-500 text-white rounded-r hover:bg-blue-600 focus:outline-none"
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
  
};

export default Chat;

