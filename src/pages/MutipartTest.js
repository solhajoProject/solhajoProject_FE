import React, { useState } from "react";
import axios from "axios";

const MultipartForm = () => {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]); // 파일 상태 업데이트
  };

  const handleTextChange = (event) => {
    setText(event.target.value); // 텍스트 상태 업데이트
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("file", file); // 파일 데이터 추가
    formData.append("text", text); // 텍스트 데이터 추가

    try {
      const response = await axios.post(
        "http://localhost:8081/api/upload",
        formData
      );
      console.log("File and text uploaded successfully:", response.data);
    } catch (error) {
      console.error("Error uploading file and text:", error);
    }
  };

  return (
    <div>
      <h1>Multipart Form Data 예제</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="text">글:</label>
          <input
            type="text"
            id="text"
            value={text}
            onChange={handleTextChange}
          />
        </div>
        <div>
          <label htmlFor="file">사진:</label>
          <input type="file" id="file" onChange={handleFileChange} />
        </div>
        <button type="submit">제출</button>
      </form>
    </div>
  );
};

export default MultipartForm;
