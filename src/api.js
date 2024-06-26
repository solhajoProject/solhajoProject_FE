import axios from "axios";

// 기본 baseURL 설정
const api = axios.create({
  baseURL: "http://localhost:8081/api",
});

// 요청 인터셉터: 모든 요청에 액세스 토큰을 헤더에 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 401 응답을 받을 경우 토큰 재발급 시도
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.log("이게뭐야", originalRequest);
    console.log("응답", error.response.data);
    if (
      error.response.data.message === "Unauthorized" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // 요청 재시도 플래그 설정

      try {
        // 서버에서 새 액세스 토큰을 요청
        const tokenResponse = await axios.post(
          "http://localhost:8081/api/reissue",
          {
            accessToken: localStorage.getItem("accessToken"), // 현재 만료된 토큰 전송
          }
        );

        // 새 토큰 저장 및 헤더 업데이트
        const newAccessToken = tokenResponse.data.data.accessToken;
        console.log("토큰", newAccessToken);
        localStorage.setItem("accessToken", newAccessToken);
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;

        // 원래 요청에 새 토큰 설정 후 재요청
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (reissueError) {
        // 토큰 재발급 실패 처리
        console.error("Failed to reissue token:", reissueError);
        localStorage.removeItem("accessToken"); // 토큰 제거
        window.location.href = "/login"; // 로그인 페이지로 이동
        return Promise.reject(reissueError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
