import axios from "axios";
import { useEffect, useState } from "react";
import io from "socket.io-client";

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

      const newSocket = io("http://localhost:3000");

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
      const res = await axios.get(`http://localhost:3000/auth/getAllUsers`, {
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
    <div>
      <div id="users">
        <h2>Users</h2>
        <ul>
          {users.map((user: any) => (
            <li key={user._id}>
              {selectedUser && selectedUser._id === user._id ? (
                <button disabled>{user.name}</button>
              ) : (
                <button onClick={() => openChat(user)}>{user.name}</button>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div id="chat">
        {selectedUser && (
          <>
            <h2>Chat with {selectedUser.name}</h2>
            <ul>
              {messages.map((message, index) => (
                <li key={index}>{message}</li>
              ))}
            </ul>
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
            />
            <button onClick={sendMessage}>Send</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;
