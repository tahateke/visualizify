import React, { useState, useEffect } from "react";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import "./components.css";

// Navigation bar on the top of each page
const NavBar = () => {
  const [loggedIn, setLoggedIn] = useState([]);

  useEffect(() => {
    let token = window.localStorage.getItem("token");
    let accountStatus = window.localStorage.getItem("accountStatus");
    setLoggedIn(token && accountStatus !== "isNonPremium" && accountStatus !== "hasNoAccess");
  }, []);

  return (
    <>
      <div>
        <ul className='navBar'>
          <li className='navOption'><a href="/" className='navButton'>Home</a></li>
          <li className='navOption'><a href="/about" className='navButton'>About</a></li>
          <li style={{float: "right"}}>{loggedIn
            ? <div className='navButtonAuth'><LogoutButton /></div>
            : <div className='navButtonAuth'><LoginButton /></div>
          }</li>
        </ul>
      </div>
    </>
  );
};
  
export default NavBar;