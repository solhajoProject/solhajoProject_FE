import React, { useState } from "react";
import axios from "axios";

const MultipartForm = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  // Access Token 갱신을 위한 함수
  const reissueAccessToken = async (expiredToken) => {
    try {
      const response = await axios.post(
        "http://localhost:8081/api/reissue",
        {
          accessToken: `Bearer ${expiredToken}`, // 요청 본문에 만료된 Access Token을 Bearer와 함께 전송
        },
        {
          headers: {
            "Content-Type": "application/json", // JSON 형식 명시
          },
        }
      );
      const newAccessToken = response.data.data; // 응답에서 갱신된 토큰을 가져옴
      if (newAccessToken) {
        localStorage.setItem("accessToken", newAccessToken); // Bearer 없이 토큰만 저장
        console.log("Access Token reissued successfully:", newAccessToken);
        return newAccessToken;
      } else {
        console.error(
          "Failed to reissue access token, response:",
          response.data
        );
        return null;
      }
    } catch (error) {
      console.error(
        "Error reissuing Access Token:",
        error.response ? error.response.data : error.message
      );
      return null;
    }
  };

  // 파일 업로드 요청을 처리하는 함수
  const uploadFile = async (token) => {
    const formData = new FormData();
    formData.append("images", file);
    formData.append("title", title);
    formData.append("description", description);

    try {
      const response = await axios.post(
        "http://localhost:8081/api/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Bearer를 추가하여 전송
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Data uploaded successfully:", response.data);
    } catch (error) {
      console.log(error.response.data);
      console.log(error.response.data.message);
      if (
        error.response &&
        error.response.data.status === "error" &&
        error.response.data.message === "Unauthorized"
      ) {
        console.error("Unauthorized error:", error.response.data.message);
        alert("회원만 가능한 기능입니다."); // Unauthorized 시 알림창 띄우기
        const newToken = await reissueAccessToken(token);

        if (newToken) {
          await uploadFile(newToken);
        } else {
          console.error(
            "Failed to reissue access token, stopping further requests"
          );
        }
      } else {
        console.error(
          "Error uploading data:",
          error.response ? error.response.data : error.message
        );
      }
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("accessToken");
    console.log("access", token);
    if (token) {
      await uploadFile(token);
    } else {
      alert("회원만 가능한 기능입니다."); // 토큰이 없을 경우 알림창 띄우기
      console.error("No auth token found in local storage");
    }
  };

  return (
    <div>
      <h1>Data Upload Form</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="file">Image:</label>
          <input type="file" id="file" onChange={handleFileChange} />
        </div>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={handleDescriptionChange}
          />
        </div>
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default MultipartForm;
