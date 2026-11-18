import React, { useState } from "react";
import api from "../services/api";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {

        try {

            const res = await api.post("/login", {
                email,
                password
            });

            // Save tokens
            localStorage.setItem("accessToken", res.data.accessToken);
            localStorage.setItem("role", res.data.role);

            alert("Login Successful");

            window.location.href = "/dashboard";

        } catch (err) {
            alert("Login Failed");
        }
    };

    return (
        <div style={{ padding: 40 }}>
            <h2>Login</h2>

            <input
                placeholder="Email"
                onChange={(e)=>setEmail(e.target.value)}
            />

            <br/><br/>

            <input
                type="password"
                placeholder="Password"
                onChange={(e)=>setPassword(e.target.value)}
            />

            <br/><br/>

            <button onClick={handleLogin}>
                Login
            </button>

        </div>
    );
}

export default Login;