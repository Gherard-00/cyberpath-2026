@echo off
title CyberPath 2026 - Compartir Proyecto (Enlace Publico)
cd /d "%~dp0"

echo ========================================================
echo   CYBERPATH 2026 - GENERADOR DE ENLACE PUBLICO
echo ========================================================
echo.
echo Iniciando servicio de orquestacion y tunel seguro...
echo.

python tunnel_service.py

if %errorlevel% neq 0 (
    echo.
    echo [!] Ocurrio un error al ejecutar el tunel.
    pause
)
