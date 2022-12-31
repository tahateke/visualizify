// Page in which users can search for songs to visualize
//Steps:
//From login need 
import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import {InputGroup, FormControl, Button, Row, Card} from 'react-bootstrap'
import {useNavigate} from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';



const SongSelect = () => {
    const [search_input, set_search_input] = useState("");
    const[songs_information, set_songs] = useState([]);
    const[loading_state, set_load] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        
    }, [])

    // Search
    async function search(){
        var token = window.localStorage.getItem("token");

        console.log("search for" + search_input);
        //Get request using search to get 
        var track_parameters = {
            method: 'GET',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : 'Bearer ' + token
            }
        }
        var trackID = await fetch('https://api.spotify.com/v1/search?q=' + search_input + '&type=track&limit=21', track_parameters)
        .then(response => response.json())
        .then(data => {return data.tracks.items} )
        
        // Clears songs and displays loading icon
        set_songs([]);
        set_load("Loading");
        
        var true_ids = [];

        for (let item = 0; item< trackID.length; item++){
            true_ids.push(trackID[item].id)
        }

        var song_info = [];
        for (let id =0; id < true_ids.length; id++){
            var song = await fetch('https://api.spotify.com/v1/tracks/' + true_ids[id], track_parameters)
                                .then(response => response.json())
                                .then(data => {song_info.push(data)} )
            if (song !== undefined){
                song_info.push(song);
            }   
        }

        set_load("");
        set_songs(song_info);
    }

    async function select_song(song_id){ 
        var token = window.localStorage.getItem("token");
        var track_parameters = {
            method: 'GET',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : 'Bearer ' + token
            }
        }

        var audio_analysis  = await fetch('https://api.spotify.com/v1/audio-analysis/' + song_id, track_parameters)
            .then(response => response.json())
            .then(data => {navigate("/visualizer", {state:{id:1, song_json: data, song_id: song_id}})} )
        
        window.song_json =  audio_analysis;
        console.log("now navigating");
        //need to pass this to the visualizer
    }


    return (
      <div style={{height: "100%"}}>
        <div>
            <InputGroup className = "mb-3" size = "lg">
                <FormControl
                placeholder = "Search for track" 
                type = "input"
                onKeyPress={event =>{
                    if (event.key === "Enter"){
                        search();
                    }
                }}
                onChange = {event=> set_search_input(event.target.value)}
                >
                </FormControl>
                <Button onClick={search}>
                    Search
                </Button>
            </InputGroup>
        </div>
        <div style={{height: "calc(100% - 64px)"}}>
            {loading_state === "Loading" &&
                <div style={{width: "20%", margin: "0 auto"}}>
                    <Box style={{padding: "30px"}} sx={{ display: 'flex' }}>
                        <CircularProgress />
                    </Box>
                </div>
            }
            <div style={{height: "100%", overflowY: "auto"}}>
                <Row className = "mx-2 row row-cols-3">
                    {songs_information.map((song) => {
                        if (song !== undefined){
                            console.log(song)
                            return(
                                //TODO: FIgure out how to click a fucking card
                                <div onClick= {() => select_song(song.id)}>
                                    <Card style={{height: "calc(100% - 20px)", marginTop: "20px"}}>
                                        <Card.Img src = {song.album.images[0].url} />
                                        <Card.Body>
                                            <Card.Title>
                                                {song.name}
                                            </Card.Title>
                                            <Card.Text>
                                                {song.artists[0].name} 
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </div>
                            )
                        }
                    })}
                </Row>
            </div>
        </div>
      </div>
    );
  };
    
  export default SongSelect;