import React, { useState, useEffect } from "react";
import axios from "axios"; // 직접 axios를 사용합니다.

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const loginData = {
      email,
      password,
    };

    try {
      const response = await axios.post(
        "http://localhost:8081/api/login",
        loginData
      );
      const token = response.data.data.accessToken;
      if (token) {
        localStorage.setItem("accessToken", token);
        setIsLoggedIn(true);
        console.log("Login Success:", token);
      } else {
        console.error("No token found in the response");
      }
    } catch (error) {
      console.error(
        "Login Error:",
        error.response ? error.response.data : error.message
      );
      if (error.response && error.response.data.message === "Unauthorized") {
        alert("이메일 또는 비밀번호가 틀렸습니다.");
        setEmail("");
        setPassword("");
      }
    }
  };

  const handleLogout = async () => {
    let accessToken = localStorage.getItem("accessToken"); // 현재 저장된 토큰을 가져옵니다.

    try {
      await axios.post("http://localhost:8081/api/logout", {
        accessToken: `Bearer ${accessToken}`, // 요청 바디에 토큰을 포함하여 전송합니다.
      });

      console.log("Logout successful");
      localStorage.removeItem("accessToken");
      setIsLoggedIn(false);
    } catch (error) {
      console.log("error", error);
      console.error(
        "Logout Error:",
        error.response ? error.response.data : error.message
      );
      if (error.response && error.response.data.message === "Unauthorized") {
        // 토큰 만료 에러 처리
        try {
          const reissueResponse = await axios.post(
            "http://localhost:8081/api/reissue",
            { accessToken: `Bearer ${accessToken}` }
          );
          accessToken = reissueResponse.data.data.accessToken;
          localStorage.setItem("accessToken", accessToken);

          // 재발급 받은 토큰으로 로그아웃 재시도
          await axios.post("http://localhost:8081/api/logout", {
            accessToken: `Bearer ${accessToken}`, // 재발급 받은 토큰을 바디에 포함하여 재요청
          });
          console.log("Retry Logout successful");
          localStorage.removeItem("accessToken");
          setIsLoggedIn(false);
        } catch (retryError) {
          console.error(
            "Retry Logout Error:",
            retryError.response ? retryError.response.data : retryError.message
          );
        }
      }
    }
  };

  const handleKakaoLogin = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/api/kakao-login-url"
      );
      window.location.href = response.data.data;
    } catch (error) {
      console.error("Kakao Login URL Error:", error);
    }
  };

  return (
    <div>
      <h1>로그인 화면 입니다.</h1>
      {!isLoggedIn ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">이메일:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">비밀번호:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">로그인</button>
          <button onClick={handleKakaoLogin}>카카오 로그인</button>
        </form>
      ) : (
        <button onClick={handleLogout}>로그아웃</button>
      )}
    </div>
  );
};

export default Login;
