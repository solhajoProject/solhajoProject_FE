import React, { useState, useEffect } from "react";
import api from "../api"; // api.js에서 설정된 axios 인스턴스를 가져옵니다.
import { useNavigate } from "react-router-dom";

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const response = await api.get("/chat"); // api 인스턴스 사용
        setRooms(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleEnterRoom = async (roomId) => {
    try {
      const response = await api.post(`/chat/${roomId}/members`); // api 인스턴스 사용
      const chatRoomMemberId = response.data.data.id; // 서버 응답 구조에 따라 경로 조정 필요
      const chatRoomName = response.data.data.roomName;
      const chatRoomOwnderName = response.data.data.ownerName;
      console.log("Entered room successfully:", response.data);
      navigate(`/chatroom/${roomId}`, {
        state: { chatRoomMemberId, chatRoomName, chatRoomOwnderName },
      });
    } catch (error) {
      console.error("Error entering room:", error);
    }
  };

  const renderRooms = () => {
    return rooms.map((room) => (
      <div
        key={room.id}
        className="room"
        style={{
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          padding: "10px",
        }}
      >
        <div style={{ flexGrow: 1 }}>
          <h4 style={{ display: "inline" }}>{room.name}</h4>
          <span
            style={{ marginLeft: "10px", fontSize: "0.8em", color: "gray" }}
          >
            ({room.capacity} seats)
          </span>
        </div>
        <button
          onClick={() => handleEnterRoom(room.id)}
          style={{ padding: "5px 10px", marginLeft: "20px" }}
        >
          입장하기
        </button>
      </div>
    ));
  };

  return (
    <div>
      <h2>Chat Rooms</h2>
      {loading ? (
        <p>Loading rooms...</p>
      ) : rooms.length > 0 ? (
        renderRooms()
      ) : (
        <p>No rooms available.</p>
      )}
    </div>
  );
};

export default RoomList;
