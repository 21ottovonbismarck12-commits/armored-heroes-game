@echo off
setlocal
cd /d "%~dp0"
title Armored Heroes - Beta 3D

echo ================================================
echo      ARMORED HEROES - BETA 3D
 echo ================================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo No se encontro Node.js.
  echo.
  echo Instala Node.js LTS desde: https://nodejs.org/
  echo Despues vuelve a ejecutar este archivo.
  pause
  exit /b 1
)

echo Instalando dependencias. La primera vez puede tardar...
call npm run install:all
if errorlevel 1 (
  echo.
  echo Hubo un problema al instalar las dependencias.
  pause
  exit /b 1
)

echo.
echo Abriendo el servidor de la beta 3D...
start "Armored Heroes Beta 3D" cmd /k "cd /d %~dp0 && npm run dev:client"
timeout /t 5 /nobreak >nul
start "" "http://localhost:5173/?demo=3d"
echo.
echo El juego deberia abrirse en el navegador.
echo Puedes cerrar esta ventana cuando termines.
pause
