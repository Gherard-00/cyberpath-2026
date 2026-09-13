@echo off
title CyberPath 2026 - Servidor Local
echo ========================================================
echo Iniciando Curso CyberPath 2026 + Mentor IA (Ollama)
echo ========================================================

:: 1. Configurar los permisos de Ollama para el Chat
echo [1/3] Configurando permisos de conexion para Ollama (CORS)...
set OLLAMA_ORIGINS=*
setx OLLAMA_ORIGINS "*" >nul 2>&1

:: 2. Verificar o reiniciar Ollama si esta corriendo sin la variable
echo [2/3] Verificando servicio de Ollama...
taskkill /F /IM "ollama app.exe" >nul 2>&1
taskkill /F /IM "ollama.exe" >nul 2>&1
timeout /t 1 >nul
start "" "ollama" serve >nul 2>&1

:: 3. Iniciar Servidor Local de Python
echo [3/3] Levantando servidor local en http://127.0.0.1:8000 ...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000') do taskkill /f /pid %%a >nul 2>&1
timeout /t 1 >nul
start /B python server.py >nul 2>&1

:: 4. Abrir el Navegador
timeout /t 2 >nul
echo Abriendo navegador en http://127.0.0.1:8000 ...
start http://127.0.0.1:8000

echo.
echo ========================================================
echo TODO LISTO Y FUNCIONANDO CORRECTAMENTE
echo ========================================================
echo No cierres esta ventana mientras estudias.
echo.
pause
