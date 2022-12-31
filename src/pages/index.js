import React from "react";
import SongSelect from "../components/SongSelectorWindow.js";

// Page in which users can search for songs to visualize
const Home = () => {
  return (
    <div style={{height: "calc(100vh - 50px)", width: "100%", backgroundColor: "lightgray"}}>
      <div>
        <h1 style={{textAlign: "center", paddingTop: "60px", paddingBottom: "20px"}}>Visualizify</h1>
      </div>
      <div style={{width: "50%", height: "calc(100% - 136px)", margin: "0 auto"}}>
        <SongSelect />
      </div>
    </div>
  );
};

export default Home;
