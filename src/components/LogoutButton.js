import React from "react";
import "./components.css";

// Log out button
const LogoutButton = () => {
    const logout = () => {
        window.localStorage.removeItem("token");
        window.location.reload();
    }

  return (
    <div>
      <button onClick={logout} className='authButton'>Logout</button>
    </div>
  );
};
  
export default LogoutButton;