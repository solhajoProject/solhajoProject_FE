import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Multipart from "./pages/Multipart";
import KakaoCallback from "./pages/KakaoCallback";
import RoomRegister from "./pages/RoomRegister";
import RoomList from "./pages/RoomList";
import ChatRoom from "./pages/ChatRoom"; // ChatRoom 컴포넌트 임포트

function App() {
  return (
    <div className="App">
      <nav>
        <Link to="/">Home</Link> | <Link to="/login">Login</Link> |{" "}
        <Link to="/signup">Signup</Link> |{" "}
        <Link to="/multipart">Multipart</Link> |{" "}
        <Link to="/roomRegister">RoomRegister</Link> |{" "}
        <Link to="/roomList">RoomList</Link>
      </nav>
      <Routes>
        <Route path="/kakao-callback" element={<KakaoCallback />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/roomRegister" element={<RoomRegister />} />
        <Route path="/multipart" element={<Multipart />} />
        <Route path="/roomList" element={<RoomList />} />
        <Route path="/chatroom/:roomId" element={<ChatRoom />} />{" "}
      </Routes>
    </div>
  );
}

export default App;
