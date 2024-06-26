import React, { useState } from "react";
import axios from "axios";

const Counter = () => {
  const [num, setNumber] = useState(0);

  const increase = () => {
    setNumber(num + 1);
  };

  const decrease = () => {
    setNumber(num - 1);
  };

  const logout = async (token) => {
    try {
      const response = await axios.post(
        "http://localhost:8081/api/logout",
        {
          accessToken: `Bearer ${token}`, // "Bearer " 접두사를 추가하여 토큰 전송
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Logout successful:", response.data);
      localStorage.removeItem("accessToken"); // 로그아웃 성공시 토큰 삭제
    } catch (error) {
      if (error.response && error.response.data.message === "Unauthorized") {
        console.error("Unauthorized, trying to reissue token");
        const newToken = await reissueToken(token);
        if (newToken) {
          logout(newToken); // 재발급 받은 토큰으로 로그아웃 재시도
        } else {
          console.error(
            "Failed to reissue access token, stopping further requests"
          );
        }
      } else {
        console.error(
          "Logout failed:",
          error.response ? error.response.data : error.message
        );
      }
    }
  };

  const reissueToken = async (oldToken) => {
    try {
      const response = await axios.post(
        "http://localhost:8081/api/reissue",
        {
          accessToken: `Bearer ${oldToken}`, // "Bearer " 접두사를 추가하여 토큰 전송
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const newToken = response.data.data; // 서버에서 응답으로 받은 새 토큰
      if (newToken) {
        localStorage.setItem("accessToken", newToken); // 새로운 토큰을 로컬 스토리지에 저장
        console.log("Token reissued successfully:", newToken);
        return newToken;
      } else {
        console.error(
          "Failed to reissue access token, response:",
          response.data
        );
        return null;
      }
    } catch (error) {
      console.error(
        "Error reissuing token:",
        error.response ? error.response.data : error.message
      );
      return null;
    }
  };

  // 초기 로그아웃 시도에서 토큰 인자를 전달
  const initialLogout = () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      logout(token);
    } else {
      console.error("No auth token found in local storage");
    }
  };

  return (
    <div>
      <button onClick={increase}>+1</button>
      <button onClick={decrease}>-1</button>
      <button onClick={initialLogout}>Logout</button>
      <p>{num}</p>
    </div>
  );
};

export default Counter;
