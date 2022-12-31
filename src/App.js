import React from "react";
import "./App.css";
import NavBar from "./components/Navbar";
import {
  RouteRequiresLogin,
  RouteRequiresNoLogin,
} from "./components/PrivateRoutes";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages";
import LogIn from "./pages/login";
import About from "./pages/about";
import Visualizer from "./pages/visualizer";

// Defines routes to each website page
function App() {
  return (
    <Router>
      <NavBar />
      <div className="appRoutes">
        <Routes>
          <Route
            exact
            path="/"
            element={
              <RouteRequiresLogin>
                <Home />
              </RouteRequiresLogin>
            }
          />
          <Route
            path="/login"
            element={
              <RouteRequiresNoLogin>
                <LogIn />
              </RouteRequiresNoLogin>
            }
          />
          <Route path="/about" element={<About />} />
          <Route
            path="/visualizer"
            element={
              <RouteRequiresLogin>
                <Visualizer />
              </RouteRequiresLogin>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
