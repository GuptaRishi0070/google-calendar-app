import { useState, useEffect } from "react";
import axios from "axios";
import EventPopup from "./EventPopup";

const GoogleSignIn = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [events, setEvents] = useState([]);

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
  const backendApiUrl = import.meta.env.VITE_BACKEND_API_URL;

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=https://www.googleapis.com/auth/calendar&access_type=offline&prompt=consent`;

  const handleGoogleSignIn = () => {
    window.location.href = googleAuthUrl;
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      exchangeCodeForTokens(code);
    }
  }, []);

  const exchangeCodeForTokens = async (code) => {
    try {
      const { data } = await axios.post(`${backendApiUrl}/api/google/signin`, { code });
      setAccessToken(data.user.accessToken);
      alert("Google Sign-In Successful!");
      fetchEvents();
    } catch (error) {
      console.error("Error exchanging code for tokens:", error);
      alert("Failed to complete Google Sign-In.");
    }
  };

  const fetchEvents = async () => {
    try {
      const { data } = await axios.post(`${backendApiUrl}/api/google/get-events`, { accessToken });
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleCreateEvent = async (eventData) => {
    try {
      await axios.post(`${backendApiUrl}/api/google/create-event`, { ...eventData, accessToken });
      alert("Event Created Successfully!");
      fetchEvents();
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Google Calendar API</h1>
      {!accessToken ? (
        <button
          onClick={handleGoogleSignIn}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Sign in with Google
        </button>
      ) : (
        <>
          <button
            onClick={() => setIsPopupOpen(true)}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Create Calendar Event
          </button>

          <div style={{ marginTop: "30px" }}>
            <h2>Upcoming Events</h2>
            <table border="1" style={{ margin: "0 auto", width: "80%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ padding: "8px", backgroundColor: "#f2f2f2" }}>ID</th>
                  <th style={{ padding: "8px", backgroundColor: "#f2f2f2" }}>Summary</th>
                  <th style={{ padding: "8px", backgroundColor: "#f2f2f2" }}>Start</th>
                  <th style={{ padding: "8px", backgroundColor: "#f2f2f2" }}>End</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id}>
                    <td style={{ padding: "8px" }}>{event.id}</td>
                    <td style={{ padding: "8px" }}>{event.summary}</td>
                    <td style={{ padding: "8px" }}>{event.start}</td>
                    <td style={{ padding: "8px" }}>{event.end}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {isPopupOpen && (
        <EventPopup
          onClose={() => setIsPopupOpen(false)}
          onSubmit={handleCreateEvent}
        />
      )}
    </div>
  );
};

export default GoogleSignIn;
