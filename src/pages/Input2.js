import React, { useState } from "react";

const Input2 = () => {
  const [inputs, setInput] = useState({
    name: "",
    email: "",
    tel: "",
  });

  const { name, email, tel } = inputs;

  const onchange = (e) => {
    const value = e.target.value;
    const id = e.target.id;
    setInput({
      ...inputs, //새로운 오브젝트를 만듬 (깊은 복사)
      [id]: value,
    });
  };

  return (
    <div>
      <div>
        <label>이름</label>
        <input type="text" id="name" value={name} onChange={onchange} />
      </div>
      <div>
        <label>이메일</label>
        <input type="email" id="email" value={email} onChange={onchange} />
      </div>
      <div>
        <label>전화번호</label>
        <input type="tel" id="tel" value={tel} onChange={onchange} />
      </div>

      <p>이름 : {name}</p>
      <p>이메일 : {email}</p>
      <p>전화번호 : {tel}</p>
    </div>
  );
};

export default Input2;
