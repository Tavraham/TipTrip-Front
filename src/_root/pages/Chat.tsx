// import axios from "axios";
// import { useEffect, useState, useRef } from "react";
// import io from "socket.io-client";

// const Chat = () => {
//   const [socket, setSocket] = useState<any>(null);
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState<any>(null);
//   const [messages, setMessages] = useState<string[]>([]);
//   const messageInputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     getAllUsers();
//   }, []);

//   useEffect(() => {
//     if (selectedUser) {
//       const newSocket = io("http://localhost:3000");
//         console.log("newSocket", newSocket.id);
        
//       newSocket.on("connect", () => {
//         console.log("Connected to server");
//         newSocket.emit("add-user", selectedUser.name);
//       });

//       newSocket.on("disconnect", () => {
//         console.log("Disconnected from server");
//       });

//       newSocket.on("msg-recieve", (msg: string) => {
//         setMessages((prevMessages) => [...prevMessages, msg]);
//       });
    
//       setSocket(newSocket);
//     }
//   }, [selectedUser]);

//   useEffect(() => {
//     return () => {
//       if (socket) {
//         socket.disconnect();
//       }
//     };
//   }, [socket]);

//   async function getAllUsers() {
//     try {
//       const res = await axios.get(`http://localhost:3000/auth/getAllUsers`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//         },
//       });
//       // Filter out the current user from the list
//       const filteredUsers = res.data.filter(
//         (user: any) => user.name !== localStorage.getItem("name")
//       );
//       setUsers(filteredUsers);
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   function openChat(user: any) {
//     setSelectedUser(user);
//     setMessages([]);
//   }

//   function sendMessage() {
//     const message = messageInputRef.current?.value;
//     if (message && socket) {
//       socket.emit("send-msg", { to: selectedUser.name, msg: message });
//       setMessages((prevMessages) => [...prevMessages, message]);
//       messageInputRef.current!.value = "";
//     }
//   }

//   return (
//     <div>
//       <div id="users">
//         <h2>Users</h2>
//         <ul>
//           {users.map((user: any) => (
//             <li key={user._id}>
//               <button onClick={() => openChat(user)}>{user.name}</button>
//             </li>
//           ))}
//         </ul>
//       </div>
//       <div id="chat">
//         {selectedUser && (
//           <>
//             <h2>Chat with {selectedUser.name}</h2>
//             <ul>
//               {messages.map((message, index) => (
//                 <li key={index}>{message}</li>
//               ))}
//             </ul>
//             <input
//               type="text"
//               ref={messageInputRef}
//               placeholder="Type your message..."
//             />
//             <button onClick={sendMessage}>Send</button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Chat;

import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const ChatComponent = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [socketId, setSocketId] = useState<string | undefined>(undefined); // State to hold socket ID

  useEffect(() => {
    const socket = io('http://localhost:3000');

    // Listen for the 'connect' event to get the socket ID
    socket.on('connect', () => {
      console.log("socket connected");
      setSocketId(socket.id);
    });

    // Listen for incoming messages from the server
    socket.on('chat message', (msg: string) => {
      setMessages(prevMessages => [...prevMessages, msg]);
    });

    // Clean up socket connection on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    const socket = io('http://localhost:3000'); // Ensure we're using the same socket for sending message
    socket.emit('chat message', currentMessage);
    setCurrentMessage('');
  };

  return (
    <div>
      <div>
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
      <input
        type="text"
        value={currentMessage}
        onChange={(e) => setCurrentMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
      <div>Socket ID: {socketId}</div> {/* Display the socket ID */}
    </div>
  );
};

export default ChatComponent;
