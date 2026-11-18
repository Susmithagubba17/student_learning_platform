import React, { useState } from "react";
import api from "../services/api";

function Register() {

    const [username,setUsername] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    const handleRegister = async () => {

        try {

            await api.post("/register",{
                username,
                email,
                password
            });

            alert("Registration Successful");
            window.location.href="/";

        } catch(err){
            alert("Registration Failed");
        }

    };

    return (
        <div style={{padding:40}}>
            <h2>Register</h2>

            <input placeholder="Username"
                onChange={(e)=>setUsername(e.target.value)}
            />
            <br/><br/>

            <input placeholder="Email"
                onChange={(e)=>setEmail(e.target.value)}
            />
            <br/><br/>

            <input type="password"
                placeholder="Password"
                onChange={(e)=>setPassword(e.target.value)}
            />
            <br/><br/>

            <button onClick={handleRegister}>
                Register
            </button>

        </div>
    );
}

export default Register;