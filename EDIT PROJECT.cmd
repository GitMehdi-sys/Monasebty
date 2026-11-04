@echo off
cd /d "%~dp0"
start "" "%LOCALAPPDATA%\Programs\Microsoft VS Code\Code.exe" "%~dp0MILEDEV.code-workspace" "%~dp0eazywed\src\pages\Home.jsx" "%~dp0START-HERE.md"
