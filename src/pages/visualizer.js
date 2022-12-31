import React from "react";
import WebPlayback from "../components/WebPlayback";
import VisualizerWindow from "../components/VisualizerWindow";
import { useLocation } from "react-router-dom";

// Page to listen to spotify tracks and visualize them
const Visualizer = () => {
  // Now We Are Free by Lisa Gerrard, different uris can be used based on user's desired track

  const location = useLocation();
  let example_uri = "spotify:track:" + location.state.song_id;
  let accountStatus = window.localStorage.getItem("accountStatus");
  console.log("WORK FUNC");
  console.log(location.state.song_json);
  console.log(location.state.name);
  console.log(location.state.song_id);

  return (
    <div className="App">
      <h1>
        {accountStatus === "isNonPremium" && (
          <p style={{ color: "red" }}>
            <i>
              Login Error: This account does not have Spotify Premium. Please
              log in with a different Spotify account.
            </i>
          </p>
        )}
        {accountStatus === "hasNoAccess" && (
          <p style={{ color: "red" }}>
            <i>
              Login Error: This account has not been granted access by the
              developers.
            </i>
          </p>
        )}
      </h1>
      <VisualizerWindow audio_data={location.state.song_json} />
      <body>{accountStatus === "" && <WebPlayback uri={example_uri} />}</body>
    </div>
  );
};

export default Visualizer;
