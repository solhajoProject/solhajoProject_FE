import React, { useState } from "react";
import axios from "axios"; // Axios 불러오기

const About = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // 폼 제출 시 페이지 새로고침 방지
    // Axios를 사용하여 서버로 데이터 전송
    try {
      const response = await axios.post(
        "http://localhost:8081/api/user",
        formData,
        {
          headers: {
            "Content-Type": "application/json", // JSON 형태로 데이터를 전송함을 명시
          },
        }
      );
      // 성공적으로 데이터를 전송했다면, 응답 처리
      console.log("Success:", response.data);
      // 여기서 성공 처리 로직을 구현하세요.
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      // 여기서 오류 처리 로직을 구현하세요.
    }
  };

  return (
    <div>
      <h1>회원가입 화면입니다.</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">사용자 이름:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="email">이메일:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="password">비밀번호:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
};

export default About;
