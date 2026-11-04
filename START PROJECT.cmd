@echo off
setlocal
set "PATH=C:\Users\walid\AppData\Local\Programs\MILEDEV-Node\node-v22.23.4-win-x64;%PATH%"
cd /d "%~dp0"
echo Starting MILEDEV at http://localhost:5173
call npm.cmd run dev
pause

