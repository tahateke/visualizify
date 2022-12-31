import React, { useState, useEffect } from "react";
import { Stage, Layer, Circle, Rect, Text } from "react-konva";
//time between frame updates measured in milliseconds
window.song_time_since = new Date();
window.song_position = 0;
window.song_playing = false;
window.song_name = "";
var local_audio_data;
let past_time = 0;
const FRAME_GAP = 5;
const IMAGE_CHANGE_RATE = 200;
let image = ``;
let background = ``;
let image_change_count = IMAGE_CHANGE_RATE + 1;
//code for image analysis

const CurrentMood = (key, mode) => {
  const majorOrMinor = [
    [
      "love sick",
      "hopeless",
      "serious",
      "somber",
      "sexual",
      "sad",
      "gloomy",
      "unease",
      "angrily displeased",
      "gentle",
      "terrible",
      "melancholic",
    ],

    [
      "innocently happy",
      "grief",
      "triumph",
      "cruel",
      "energetic",
      "furious",
      "relief",
      "magnificent",
      "death",
      "joyful",
      "cheerful",
      "strong",
    ],
  ];
  return majorOrMinor[mode][key];
};

const FindSectionIndex = (current_time) => {
  for (let i = 0; i < local_audio_data["sections"].length; i++) {
    if (
      current_time >= local_audio_data["sections"][i]["start"] &&
      current_time <=
      local_audio_data["sections"][i]["start"] +
      local_audio_data["sections"][i]["duration"]
    ) {
      return i;
    }
  }
};

const DisplayEdgeDetection = (sec) => {
  const mood = CurrentMood(
    parseInt(local_audio_data["sections"][sec]["key"]),
    parseInt(local_audio_data["sections"][sec]["mode"])
  );

  const url =
    `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=0a700bcbc4b13e110b7893e172cdb654&
                tags=` +
    mood +
    `&media=photos&per_page=100&page=1&format=json&nojsoncallback=1`;

  fetch(url)
    .then((response) => {
      if (!response.ok) throw Error(response.statusText);
      return response.json();
    })
    .then((data) => {
      let picarray = data.photos.photo.map(
        (pic) =>
          `https://live.staticflickr.com/` +
          pic.server +
          `/` +
          pic.id +
          `_` +
          pic.secret +
          `.jpg`
      );
      return picarray;
    })
    .then((images) => {
      const random_index = Math.floor(Math.random() * 100);
      image = images[random_index];
    })
    .catch((error) => console.log(error));

  const temp = document.getElementById("cvCode");
  if (temp === null) {
    const cv_script = document.createElement("script");
    cv_script.id = "cvCode";
    cv_script.src = "https://docs.opencv.org/4.6.0/opencv.js";
    cv_script.async = true;
    cv_script.onload = "onOpenCvRead();";
    document.body.appendChild(cv_script);

    const canvas1 = document.createElement("canvas");
    canvas1.id = "imgCanvas";
    canvas1.style = "display:none;";
    document.body.appendChild(canvas1);
    const canvas2 = document.createElement("canvas");
    canvas2.id = "edgeDetectionCanvas";
    document.body.appendChild(canvas2);

    const img = document.createElement("img");
    img.id = "imageSrc";
    img.crossOrigin = "Anonymous";
    img.width = 600;
    img.height = 600;
    img.style = "display:none;";
    //  width="600" height="600" style="border:1px solid #c3c3c3;"
    document.body.appendChild(img);
  }
  document.getElementById("imageSrc").src = image;

  let imgElement = document.getElementById("imageSrc");

  imgElement.onload = function () {
    let mat = window.cv.imread(imgElement);
    window.cv.cvtColor(mat, mat, window.cv.COLOR_RGB2GRAY, 0);
    window.cv.Canny(mat, mat, 50, 100, 3, false);
    window.cv.imshow("imgCanvas", mat);
    const canvas = document.getElementById("imgCanvas");
    background = canvas.toDataURL();

    mat.delete();
  };
};

//code for audio analysis

const CurrentPulse = (current_time, i) => {
  const PULSE_LENGTH = 0.1;
  let first_time = local_audio_data["segments"][i]["start"];
  let max_time = local_audio_data["segments"][i]["loudness_max_time"];
  if (Math.abs(current_time - first_time - max_time) < PULSE_LENGTH) {
    return 0.9;
  }
  return 0.6;
};

const CurrentLoudness = (current_time, i) => {
  let start_volume = local_audio_data["segments"][i]["loudness_start"];
  let end_volume = local_audio_data["segments"][i + 1]["loudness_start"];
  let first_time = local_audio_data["segments"][i]["start"];
  let end_time = local_audio_data["segments"][i + 1]["start"];
  let slope = (end_volume - start_volume) / (end_time - first_time);
  let current_volume = start_volume + slope * (current_time - first_time);
  const BASE_SHAPE_SIZE = 30;
  const MIN_VOLUME = -40;
  const VARIATION_MULTIPLIER = 2;
  let r = (current_volume - MIN_VOLUME) * VARIATION_MULTIPLIER;
  if (r < 0) {
    return BASE_SHAPE_SIZE;
  }
  return BASE_SHAPE_SIZE + r;
};

const CurrentPitch = (i, pos, current_time) => {
  const PITCH_HEIGHT = window.innerHeight - 400;
  const cur_pitch = local_audio_data["segments"][i]["pitches"][pos];
  const next_pitch = local_audio_data["segments"][i + 1]["pitches"][pos];
  const start = local_audio_data["segments"][i]["start"];
  const end = local_audio_data["segments"][i + 1]["start"];
  const trans =
    ((next_pitch - cur_pitch) * (current_time - start)) / (end - start);
  return (cur_pitch + trans) * PITCH_HEIGHT + 100;
};

const FindSegmentIndex = (current_time) => {
  for (let i = 0; i < local_audio_data["segments"].length; i++) {
    if (
      current_time >= local_audio_data["segments"][i]["start"] &&
      current_time <=
      local_audio_data["segments"][i]["start"] +
      local_audio_data["segments"][i]["duration"]
    ) {
      return i;
    }
  }
};

const SendImage = () => {
  const temp = new window.Image();
  temp.src = background;
  return temp;
};

const DisplayScreen = (current_time) => {
  if (window.song_playing) {
    past_time = current_time;
    image_change_count++;
  } else {
    current_time = past_time;
  }
  if (current_time === undefined) {
    return;
  }
  let i = FindSegmentIndex(current_time);
  if (i + 1 >= local_audio_data["segments"].length || i === undefined) {
    current_time = 0;
    i = 0;
  }
  const positions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const loudness = CurrentLoudness(current_time, i);
  const pulse = CurrentPulse(current_time, i);
  const sec = FindSectionIndex(current_time);
  if (image_change_count > IMAGE_CHANGE_RATE) {
    image_change_count = 0;
    DisplayEdgeDetection(sec);
  }

  const min_start = Math.floor(current_time / 60);
  const sec_start = Math.floor(current_time % 60);
  let time_start;
  if (sec_start < 10) {
    time_start = min_start + ":0" + sec_start;
  } else {
    time_start = min_start + ":" + sec_start;
  }
  const min_end = Math.floor(
    (local_audio_data["track"]["duration"] - current_time) / 60
  );
  const sec_end = Math.floor(
    (local_audio_data["track"]["duration"] - current_time) % 60
  );
  let time_end;
  if (sec_end < 10) {
    time_end = min_end + ":0" + sec_end;
  } else {
    time_end = min_end + ":" + sec_end;
  }
  const gap2 = (window.innerWidth - 200) / 13;
  return positions.map((pos) => {
    return (
      <React.Fragment key={pos}>
        <Circle
          x={100 + (1 + pos) * gap2}
          y={CurrentPitch(i, pos, current_time)}
          radius={loudness}
          fill={"green"}
          opacity={pulse}
        />
        <Rect
          x={50}
          y={window.innerHeight - 170}
          width={
            (window.innerWidth - 100) *
            (current_time / local_audio_data["track"]["duration"])
          }
          height={5}
          fill={"black"}
        />
        <Text
          x={50}
          y={window.innerHeight - 160}
          text={time_start}
          fontSize={15}
          fontFamily={"Arial"}
          fill={"black"}
        />
        <Text
          align={"right"}
          y={window.innerHeight - 160}
          text={time_end}
          fontSize={15}
          fontFamily={"Arial"}
          fill={"black"}
          wrap={"word"}
          width={window.innerWidth - 50}
        />
        <Text
          align={"center"}
          y={window.innerHeight - 160}
          text={window.song_name}
          fontSize={20}
          fontFamily={"Arial"}
          fill={"black"}
          width={window.innerWidth}
        />
      </React.Fragment>
    );
  });
};

const VisualizerWindow = (props) => {
  local_audio_data = props.audio_data;
  const [current_time, compare_time] = useState(0);
  useEffect(() => {
    setInterval(() => {
      compare_time(
        (Date.now() - window.song_time_since + window.song_position) / 1000
      );
    }, FRAME_GAP);
  }, []);

  return (
    <Stage width={window.innerWidth} height={window.innerHeight - 130}>
      <Layer>
        <Rect
          x={50}
          y={0}
          width={window.innerWidth - 100}
          height={window.innerHeight - 200}
          fillPatternImage={SendImage()}
        />
        <Rect
          x={50}
          y={window.innerHeight - 170}
          width={window.innerWidth - 100}
          height={5}
          fill={"lightgray"}
        />
      </Layer>
      <Layer>{DisplayScreen(current_time)}</Layer>
    </Stage>
  );
};

export default VisualizerWindow;
