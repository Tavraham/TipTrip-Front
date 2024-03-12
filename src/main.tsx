import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";
import axios from 'axios';
import { googleClientIdRoute } from "./utils/apiRoutes";

// Function to fetch Google OAuth client ID from the backend
async function fetchGoogleClientId() {
  try {
    const response = await axios.get(googleClientIdRoute);
    return response.data.clientId;
  } catch (error) {
    console.error('Error fetching Google client ID:', error);
    return null;
  }
}

// Fetch Google OAuth client ID and render the app
fetchGoogleClientId().then(googleClientId => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
      <GoogleOAuthProvider clientId={googleClientId}>
        <App />
      </GoogleOAuthProvider>
    </BrowserRouter>
  );
});
