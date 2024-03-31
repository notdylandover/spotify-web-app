require('dotenv').config();
const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI
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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});