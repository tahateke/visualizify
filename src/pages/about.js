import React from "react";
import MusicWaves from "../images/MusicWaves.png";

// Page that contains information about our application
const About = () => {
  return (
    <div>
      <div style={{padding: "20px"}}>
        <div style={{padding: "20px", backgroundColor: "lightgray"}}>
          <h3 style={{textAlign: "center", color: "black"}}>
            This is a music visualizer designed so that people with hearing impairments can enjoy all of Spotify's music. Simply log in with a Spotify Premium account, search for any song, and enjoy a custom visualization created as the song plays. This application was created as an academic project by students attending the University of Michigan, and it strives to promote inclusivity by providing an alternative music experience.
          </h3>
        </div>
      </div>
      <div style={{height: "300px", backgroundSize: "100% 100%", backgroundImage: `url(${MusicWaves})`}} />
    </div>
  );
};
  
export default About;