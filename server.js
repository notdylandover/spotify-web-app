require('dotenv').config();
const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const path = require('path');
const net = require('net');

const app = express();
let port = parseInt(process.env.PORT, 10) || 3000;

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI,
});

app.use(express.static('src'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'login.html'));
});

app.get('/login', (req, res) => {
  const scopes = ['user-read-private', 'user-read-email', 'user-read-currently-playing'];
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes);
  res.redirect(authorizeURL);
});

app.get('/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const { access_token, refresh_token } = data.body;
    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(refresh_token);
    res.redirect('/app');
  } catch (error) {
    console.error(error.message);
  }
});

app.get('/app', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'app.html'));
});

app.get('/currently-playing', async (req, res) => {
  try {
    const response = await spotifyApi.getMyCurrentPlayingTrack();
    res.json(response.body);
  } catch (error) {
    console.error(error.message);
  }
});

const startServer = (port) => {
  const server = net.createServer();
  server.once('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is already in use. Trying port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error(err);
    }
  });

  server.once('listening', () => {
    server.close();
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  });

  server.listen(port);
};

startServer(port);
