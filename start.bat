@echo off
cls
title Installing Dependencies...
call src/install.bat
cls
title Spotify Web Application
node server.js
pause
call start.bat