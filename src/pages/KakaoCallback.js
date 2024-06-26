import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const KakaoCallback = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (!code) {
      console.error("Code not found from Kakao redirect");
      return;
    }

    async function fetchKakaoToken() {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/kakao-callback?code=${code}`
        );

        const token = response.data.data.body.data;
        console.log("token: " + token);

        console.log(response.data.data.body.status);
        if (response.data.data.body.status === "fail") {
          alert("이미 가입된 회원입니다.");
          navigate("/Login");
        }

        if (token) {
          localStorage.setItem("accessToken", token);
          navigate("/");
        } else {
          console.error("No token found in the response");
        }
      } catch (error) {
        console.error("Error fetching token:", error);
      } finally {
        setIsLoading(false); // 로딩 상태 해제
      }
    }

    if (isLoading) {
      fetchKakaoToken();
    }
  }, [isLoading, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return null; // 로딩이 끝난 후에는 아무것도 렌더링하지 않음
};

export default KakaoCallback;
