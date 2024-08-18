import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { useEffect, useState } from "react";

function ProtectedRoute({ children }) {
    const [isAuthorized, setisAuthorized] = useState(null);

    useEffect(() => {
        auth().catch(() => setisAuthorized(false));
    }, []);

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try {
            // get a access token from the refresh token
            const res = await api.post("/api/token/refresh/", 
                {
                    refresh: refreshToken,
                }   
            );

        if (res.status === 200) {
            // set the access token in the local storage
            localStorage.setItem(ACCESS_TOKEN, res.data.access);
            setisAuthorized(true);
        } else {
            setisAuthorized(false);
        }

        } 
        catch (error) 
        {
            console.log(error);
            setisAuthorized(false);
        }
    };

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        // Check if we have token
        if (!token) {
        setisAuthorized(false);
        return;
        }
        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp;
        const now = Date.now() / 1000;

        // Expire date of the token if expire get the access token from the refresh token
        if (tokenExpiration < now) {
            await refreshToken();
        } else {
            setisAuthorized(true);
        }
    };

    if (isAuthorized === null) {
        return <div>Loading......</div>;
    }

    return isAuthorized ? children : <Navigate to="/login" />;
}
export default ProtectedRoute;
