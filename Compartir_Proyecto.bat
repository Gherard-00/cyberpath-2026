@echo off
title Compartir Proyecto CyberPath con IA (ChatGPT / Claude)
echo ========================================================
echo   Compartiendo CyberPath mediante Tunel Seguro SSH
echo ========================================================
echo.

:: 1. Verificar si el servidor ya esta corriendo en el puerto 8000
netstat -ano | findstr :8000 >nul 2>&1
if %errorlevel% neq 0 (
    echo [1/2] Iniciando servidor local en segundo plano...
    start /B python server.py
    timeout /t 2 >nul
) else (
    echo [1/2] Servidor local ya detectado en puerto 8000.
)

:: 2. Iniciar el tunel publico con localhost.run
echo [2/2] Creando enlace publico compartible...
echo --------------------------------------------------------
echo Tu enlace aparecera a continuacion (busca la linea con https://...):
echo Puedes pegarle esta URL a ChatGPT o Claude para que naveguen el sitio.
echo Para cerrarlo, simplemente cierra esta ventana.
echo --------------------------------------------------------
echo.

python tunnel_service.py

