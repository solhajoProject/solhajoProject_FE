import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import "../ChatRoom.css"; // 상단에 CSS 파일 임포트

const ChatRoom = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const { chatRoomMemberId, chatRoomName, chatRoomOwnerName } = location.state;

  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [username, setUsername] = useState("");
  const stompClient = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const socket = new SockJS(`http://localhost:8081/ws`);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (str) => console.log(str),
    });

    client.onConnect = () => {
      client.subscribe(`/chatroom/${roomId}`, (message) => {
        const newMessage = JSON.parse(message.body);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });
    };

    stompClient.current = client;
    client.activate();

    return () => {
      client.deactivate();
    };
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      const authorize = async () => {
        try {
          const response = await axios.post(
            "http://localhost:8081/api/user/authorize",
            { accessToken: `Bearer ${accessToken}` }
          );
          setUsername(response.data.data.userName);
        } catch (error) {
          console.error("Authorization failed:", error);
          alert("Authorization failed. Please log in again.");
        }
      };
      authorize();
    }
  }, []);

  const sendMessage = () => {
    if (messageInput.trim() && stompClient.current) {
      const chatMessage = {
        sender: username,
        content: messageInput,
        roomId,
        chatRoomMemberId,
      };
      stompClient.current.publish({
        destination: "/api/chatroom.sendMessage",
        body: JSON.stringify(chatMessage),
      });
      setMessageInput("");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        "{chatRoomName}" 채팅방 (방장: {chatRoomOwnerName})
      </div>
      <div className="chat-messages" id="messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${
              msg.sender === username ? "my-message" : "their-message"
            }`}
          >
            {msg.sender !== username && (
              <div className="sender-name">{msg.sender}</div>
            )}
            <div className="message-content">{msg.content}</div>
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* 스크롤 위치 조정용 요소 */}
      </div>
      <div className="input-area">
        <input
          className="input-text"
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
        />
        <button className="send-button" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
