import { useState } from "react";

function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {

    fetch("http://127.0.0.1:8000/api/users/login/", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        username: username,
        password: password
      })

    })

    .then(response => response.json())

    .then(data => {

      console.log(data);

      localStorage.setItem(
        "token",
        data.access
      );

      alert("Login Successful");

    });

  };


  return (

    <div>

      <h1>Login</h1>

      <input
        placeholder="Username"
        onChange={(e)=>setUsername(e.target.value)}
      />

      <input
        placeholder="Password"
        type="password"
        onChange={(e)=>setPassword(e.target.value)}
      />

      <button onClick={login}>
        Login
      </button>

    </div>

  );

}

export default Login;