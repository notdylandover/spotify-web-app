<!-- Title and Description -->
# Basic Spotify Web Application
**A Basic Spotify Web Application.**
<!-- How to Setup -->
## How to Setup:
#### 1. Know what port you can use.
- If you have other web apps running, they might be using port 3000. Please make sure when running the app that you configure the settings to the correct port.
#### 2. Go to https://developer.spotify.com/dashboard
#### 3. Create an app
- Name and Description can be anything
- Ignore the website text box
- Set the Redirect URI to `http://localhost:3000/callback`
- Checkmark the Web API
- Once created, head to `Settings` in the top right
- Copy the `ClientID`, `Client Secret`, and the `Redirect URI` to the `TEMPLATE.env` file.
- Port can be 3000.
- Rename `TEMPLATE.env` to just `.env`.
#### 4. Run the `start.bat` file. Leave the console open.
#### 5. Go to `localhost:3000` in any browser.
#### 6. Sign in to Spotify.
#### 7. Done.
<!-- How to import to OBS -->
## How to import to OBS:
#### 1. In OBS, import a browser source.
- URL is `localhost:3005/app`.
- Width can be anything, but the height must be at least `230px`.
> [!NOTE]
> You may have to refresh the source for it to update the album art and track info.
#### 3. Done
## Screenshots
<img alt="Without Out - The Kid LAROI" src="./screenshots/example1.png" width="512px">
<img alt="Versace on the Floor - Bruno Mars" src="./screenshots/example2.png" width="512px">