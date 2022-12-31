import React, { useEffect } from "react";

// Log in button
const LoginButton = () => {
  const CLIENT_ID = "8eaf4de8634445e6bde5c1592b51dbca";
  const REDIRECT_URI = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  const AUTH_SCOPES = [
    'user-modify-playback-state',
    'user-read-currently-playing',
    'user-read-playback-state',
    'user-read-private',
    'streaming'
  ]

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");
    let removeStaleToken = window.localStorage.getItem("removeStaleToken");
    window.localStorage.removeItem("removeStaleToken");

    // Remove stale token if current token is rejected by isLoggedIn()
    if (token && removeStaleToken) {
      window.localStorage.removeItem("token");
      // Refresh navbar
      window.location.reload();
    }

    // Handle auth provided by API after Spotify login
    token = window.localStorage.getItem("token");
    if (!token && hash) {
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
      window.localStorage.setItem("accountStatus", "");
      window.location.reload();
    }
  }, []);

  return (
    <div>
      <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${AUTH_SCOPES.join("%20")}&show_dialog=true&response_type=${RESPONSE_TYPE}`} className='authButton'>
        Log In with Spotify
      </a>
    </div>
  );
};
  
export default LoginButton;