import React from "react";
import LoginButton from "../components/LoginButton";
import MusicEqualizer from "../images/MusicEqualizer.png";
import MusicNotes from "../images/MusicNotes.png";
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { maxHeight } from "@mui/system";

// Page in which users can log in to Spotify Premium
const LogIn = () => {
  let accountStatus = window.localStorage.getItem("accountStatus");
  return (
    <Grid container component="main" sx={{ height: 'calc(100vh - 50px)' }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: `url(${MusicEqualizer})`,
          backgroundRepeat: 'no-repeat',
          backgroundColor: 'black',
          backgroundSize: "100% 100%",
          backgroundPosition: 'center',
        }}
      />
      <Grid item xs={12} sm={8} md={5} sx={{maxHeight: "100%",}} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            maxHeight: "calc(100% - 65px)",
            overflow: "hidden",
          }}
        >
          <Typography component="h1" variant="h1">
            Visualizify
          </Typography>
          <Typography component="h1" variant="h5">
            A Music Visualizer
          </Typography>
          <div style={{paddingTop: "15px", paddingBottom: "30px"}}>
            <LoginButton />
          </div>
          {accountStatus === "isNonPremium" && <p style={{color: "red"}}><i>Login Error: This account does not have Spotify Premium. Please log in with a different Spotify account.</i></p>}
          {accountStatus === "hasNoAccess" && <p style={{color: "red"}}><i>Login Error: This account has not been granted access by the developers.</i></p>}
          <Typography component="h1" variant="h6" align="center">
            This application is under development. Only users who have explicitly been granted access will be able to log in using a Spotify Premium account.
          </Typography>
          <img src={MusicNotes} alt="" style={{height: "75%", width: "75%"}}/>
        </Box>
      </Grid>
    </Grid>
  );
};
  
export default LogIn;