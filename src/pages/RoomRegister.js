import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; // api.js에서 설정된 axios 인스턴스를 가져옵니다.

const RoomRegister = () => {
  const [roomName, setRoomName] = useState("");
  const [capacity, setCapacity] = useState("");
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 라우팅을 제어합니다.

  // 폼 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault(); // 폼 기본 제출 동작 방지

    // 폼 데이터를 백엔드 서버로 보내는 로직 (api 사용)
    api
      .post("/chat", {
        // `axios` 대신 `api` 사용
        name: roomName,
        capacity: parseInt(capacity, 10),
      })
      .then((response) => {
        console.log("Success:", response.data);
        // 성공 후 작업, 예를 들어 페이지 이동 등
        setRoomName(""); // 입력 필드 초기화
        setCapacity("");

        console.log(response);
        // 채팅 페이지로 이동
        navigate(`/chat/${response.data.data.id}`); // 서버 응답에서 roomId를 가져와 사용합니다.
      })
      .catch((error) => {
        console.error(
          "Error:",
          error.response ? error.response.data : "Unknown error"
        );
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Room Register</h1>
      <div>
        <label htmlFor="roomName">방 제목:</label>
        <input
          type="text"
          id="roomName"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="capacity">최대 인원:</label>
        <input
          type="number"
          id="capacity"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          required
        />
      </div>
      <button type="submit">방 만들기</button>
    </form>
  );
};

export default RoomRegister;
