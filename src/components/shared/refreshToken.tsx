import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const refreshToken = ():void => {

    const navigate = useNavigate();
      // Function to refresh token
  const refreshT = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/auth/refreshToken",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
          },
        }
      );
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
    } catch (error) {
      console.error(error);
      // Handle error, e.g., logout user, redirect to login page, etc.
    }
  };

  // Function to check access token expiry and trigger refresh if needed
  const checkAccessTokenExpiry = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      // Access token not found, maybe user is not logged in
      try {
        const decodedToken = jwtDecode(accessToken); 
        if (!decodedToken || !decodedToken.exp) {
          // Token is invalid or doesn't contain an expiration claim
          throw new Error("Invalid token or missing expiration claim");
        }
        const currentTime = Date.now() / 1000; // Convert milliseconds to seconds
        if (decodedToken.exp < currentTime) {
          // Access token is expired, refresh it
          await refreshT();
          navigate("/home");
        }
      } catch (error) {
        console.error(error);
      }
    }
    
  };

  // Call this function when your app initializes or when appropriate
  checkAccessTokenExpiry();

}

export default refreshToken