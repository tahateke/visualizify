import React, { useState, useEffect } from "react";

const track = {
  name: "",
  album: {
    images: [{ url: "" }],
  },
  artists: [{ name: "" }],
};

const WebPlayback = (props) => {
  const [is_paused, setPaused] = useState(true);
  const [player, setPlayer] = useState(undefined);
  const [current_track, setTrack] = useState(track);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const token = window.localStorage.getItem("token");
      const player = new window.Spotify.Player({
        name: "Web Playback SDK",
        getOAuthToken: (cb) => {
          cb(token);
        },
        volume: 0.5,
      });

      setPlayer(player);

      player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
        fetch(
          `https://api.spotify.com/v1/me/player/play?device_id=${device_id}`,
          {
            method: "PUT",
            body: JSON.stringify({ uris: [`${props.uri}`] }),
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.addListener("player_state_changed", (state) => {
        if (!state) {
          return;
        }
        window.song_time_since = new Date();
        window.song_position = state.position;
        window.song_playing = !state.paused;
        setTrack(state.track_window.current_track);
        window.song_name = state.track_window.current_track.name;
        setPaused(state.paused);
      });

      player.connect();
    };
  }, [props]);

  return (
    <>
      <button
        className="btn-navback"
        onClick={() => {
          window.location.href = "/";
        }}
      >
        {"BACK TO SEARCH"}
      </button>
      <button
        className="btn-spotify"
        onClick={() => {
          player.togglePlay();
        }}
      >
        {is_paused ? "PLAY" : "PAUSE"}
      </button>
    </>
  );
};

export default WebPlayback;
