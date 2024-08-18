import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import '../styles/Form.css'
import LoadingIndicator from "./LoadingIndicator";

function Form({ route, method }) {
    const [username, setusername] = useState("");
    const [password, setpassword] = useState("");
    const [loading, setloading] = useState(false);
    const navigate = useNavigate();
    const name = method === "login" ? "Login" : "Register";
    const altRoute = method !== "login" ? "/login" : "/register";
    const altButtonText = method !== "login" ? "Login" : "Register";

    const handleSubmit = async (e) => {
        setloading(true);
        e.preventDefault();

        try {
            const res = await api.post(route, { username, password });
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/");
            } else {
                navigate("/login");
            }
        } catch (error) {
            alert(error);
        } finally {
            setloading(false);
        }
    };

    const handleAltButtonClick = (e) => {
        e.preventDefault();
        navigate(altRoute);
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>{name}</h1>
            <input
                className="form-input"
                type="text"
                value={username}
                onChange={(e) => setusername(e.target.value)}
                placeholder="Username"
            />
            <input
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
                placeholder="Password"
            />
            {loading && <LoadingIndicator />}
            <button className="form-button" type="submit">
                {name}
            </button>
            <button className="form-button" type="button" onClick={handleAltButtonClick}>
                {altButtonText}
            </button>
        </form>
    );
}

export default Form;
