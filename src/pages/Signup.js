import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // useNavigate 훅 불러오기

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // 폼 제출 시 페이지 새로고침 방지
    try {
      const response = await axios.post(
        "http://localhost:8081/api/signup",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Success:", response.data);
      // 성공 처리 로직
      if (response.data.status === "success") {
        alert("회원가입 완료되었습니다."); // 성공 알림
        navigate("/"); // 홈 페이지로 리다이렉트
      }
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      // 오류 처리 로직
      if (error.response && error.response.data.status === "fail") {
        alert("이미 가입된 이메일입니다."); // 사용자에게 알림
        setFormData({ ...formData, email: "" }); // 이메일 입력 필드 초기화
      }
    }
  };

  return (
    <div>
      <h1>회원가입 화면입니다.</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">사용자 이름:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
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

export default Signup;
