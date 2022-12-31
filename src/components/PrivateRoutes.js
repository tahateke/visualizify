// This is used to determine if a user is authenticated and
// if they are allowed to visit the page they navigated to.

// If they are: they proceed to the page
// If not: they are redirected to the login page.
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

// Checks if a user is logged in to Spotify Premium
async function isLoggedIn() {
  let token = "Bearer " + window.localStorage.getItem("token");
  const response = await fetch("https://api.spotify.com/v1/me", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token,
    },
  });

  if (response.ok) {
    const userData = await response.json();
    if (userData["product"] === "premium") {
      return true;
    } else {
      // Set when a user tries to log in with a non-premium Spotify account
      window.localStorage.setItem("accountStatus", "isNonPremium");
      // Refresh navbar
      window.location.reload();
    }
  } else if (response.status === 403) {
    // Set when a user tries to log in with an account that hasn't been granted access (Spotify for Developers dev mode)
    window.localStorage.setItem("accountStatus", "hasNoAccess");
    // Refresh navbar
    window.location.reload();
  }

  // Setting stale token to be removed
  window.localStorage.setItem("removeStaleToken", "true");
  return false;
}

// Redirects users to /login if they need valid login auth (ensures that certain pages can only be visited while logged in)
const RouteRequiresLogin = ({ children }) => {
  const [userIsLoggedIn, setLogin] = useState([]);
  useEffect(() => {
    isLoggedIn().then((loginStatus) => {
      setLogin(loginStatus);
    });
  }, []);

  if (userIsLoggedIn === true || userIsLoggedIn === false) {
    return userIsLoggedIn ? children : <Navigate to="/login" />;
  }
};

// Redirects users to / if they have already logged in (ensures that /login cannot be visited while logged in)
// Will only be used around the /login path
const RouteRequiresNoLogin = ({ children }) => {
  const [userIsLoggedIn, setLogin] = useState([]);
  useEffect(() => {
    isLoggedIn().then((loginStatus) => {
      setLogin(loginStatus);
    });
  }, []);

  if (userIsLoggedIn === true || userIsLoggedIn === false) {
    return !userIsLoggedIn ? children : <Navigate to="/" />;
  }
};

export { RouteRequiresLogin, RouteRequiresNoLogin };
