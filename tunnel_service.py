import subprocess
import re
import time
import threading
import urllib.request
import sys
import os
import atexit
import signal
import json

current_url = None
stop_event = threading.Event()
server_proc = None
tunnel_proc = None

def get_tunnel_command(base_dir):
    """Determina el comando SSH según la configuración (anónimo o con clave persistente)."""
    config_file = os.path.join(base_dir, "tunnel_config.json")
    ssh_user = "nokey"
    custom_host = "localhost.run"
    
    if os.path.exists(config_file):
        try:
            with open(config_file, "r", encoding="utf-8") as f:
                cfg = json.load(f)
                ssh_user = cfg.get("ssh_user", "nokey")
                custom_host = cfg.get("host", "localhost.run")
        except Exception:
            pass

    return [
        "ssh",
        "-o", "StrictHostKeyChecking=no",
        "-o", "ServerAliveInterval=15",
        "-o", "ServerAliveCountMax=3",
        "-R", "80:127.0.0.1:8000",
        f"{ssh_user}@{custom_host}"
    ], ssh_user

def is_server_ready():
    """Comprueba si el servidor local responde con HTTP 200."""
    try:
        req = urllib.request.Request(
            "http://127.0.0.1:8000/index.html",
            headers={'User-Agent': 'CyberPath-HealthCheck/1.0'}
        )
        with urllib.request.urlopen(req, timeout=1.5) as resp:
            return resp.status == 200
    except Exception:
        return False

def ensure_server(base_dir):
    """Garantiza que server.py esté corriendo antes de iniciar el túnel."""
    global server_proc
    if is_server_ready():
        print("[+] Servidor local de CyberPath ya estaba activo en http://127.0.0.1:8000", flush=True)
        return

    print("[*] Iniciando servidor local (server.py)...", flush=True)
    server_path = os.path.join(base_dir, "server.py")
    server_proc = subprocess.Popen(
        [sys.executable, server_path],
        cwd=base_dir,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )

    for i in range(20):
        time.sleep(0.5)
        if is_server_ready():
            print("[+] Servidor local verificado y listo en http://127.0.0.1:8000", flush=True)
            return

    print("[!] Advertencia: El servidor local no respondió en 10s, intentando continuar...", flush=True)

def copy_to_clipboard(text):
    """Copia texto al portapapeles de Windows mediante clip.exe."""
    try:
        proc = subprocess.Popen("clip", stdin=subprocess.PIPE, shell=True)
        proc.communicate(input=text.strip().encode("utf-8"))
        return True
    except Exception:
        return False

def keep_alive_worker():
    """Mantiene activa la conexión enviando peticiones periódicas."""
    global current_url
    while not stop_event.is_set():
        for _ in range(45):
            if stop_event.is_set():
                return
            time.sleep(1)
        if current_url:
            try:
                req = urllib.request.Request(
                    f"{current_url}/index.html",
                    headers={'User-Agent': 'CyberPath-Tunnel-KeepAlive/1.0'}
                )
                with urllib.request.urlopen(req, timeout=10) as resp:
                    pass
            except Exception:
                pass

def cleanup():
    """Limpia los procesos hijos y elimina el archivo de URL al salir para evitar enlaces obsoletos."""
    global server_proc, tunnel_proc
    stop_event.set()
    
    base_dir = os.path.dirname(os.path.abspath(__file__))
    url_file = os.path.join(base_dir, "tunnel_url.txt")
    if os.path.exists(url_file):
        try:
            os.remove(url_file)
        except Exception:
            pass

    if tunnel_proc and tunnel_proc.poll() is None:
        try:
            tunnel_proc.terminate()
        except Exception:
            pass
    if server_proc and server_proc.poll() is None:
        try:
            server_proc.terminate()
        except Exception:
            pass

def main():
    global current_url, tunnel_proc
    base_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(base_dir)
    url_file = os.path.join(base_dir, "tunnel_url.txt")

    atexit.register(cleanup)
    signal.signal(signal.SIGINT, lambda sig, frame: sys.exit(0))
    signal.signal(signal.SIGTERM, lambda sig, frame: sys.exit(0))

    tunnel_cmd, ssh_user = get_tunnel_command(base_dir)

    print("\n========================================================")
    print("      CyberPath 2026 - Conexión de Túnel Público")
    print("========================================================\n")

    ensure_server(base_dir)

    t = threading.Thread(target=keep_alive_worker, daemon=True)
    t.start()

    while not stop_event.is_set():
        mode_str = "anónimo (subdominio temporal)" if ssh_user == "nokey" else f"usuario registrado ({ssh_user})"
        print(f"\n[*] Estableciendo túnel SSH con localhost.run [{mode_str}]...", flush=True)
        try:
            tunnel_proc = subprocess.Popen(
                tunnel_cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                bufsize=1
            )
            url_announced = False
            for line in tunnel_proc.stdout:
                if "Welcome to localhost.run" in line or "connection id" in line or "QR:" in line:
                    continue
                match = re.search(r'https://[a-zA-Z0-9\.\-]+\.lhr\.life', line)
                if match and not url_announced:
                    current_url = match.group(0)
                    url_announced = True
                    with open(url_file, "w", encoding="utf-8") as f:
                        f.write(current_url)
                    copy_to_clipboard(current_url)

                    print("\n" + "=" * 68)
                    print("  >>> ¡ENLACE PÚBLICO DE CYBERPATH GENERADO CON ÉXITO! <<<")
                    print("=" * 68)
                    print(f"\n  URL ACTIVA:  {current_url}\n")
                    print("  [OK] Enlace copiado automáticamente al portapapeles.")
                    print("  [OK] Acceso verificado para compañeros (Chrome, Edge, móvil).")
                    print("  [OK] Acceso habilitado para Claude / ChatGPT (robots.txt OK).")
                    if ssh_user == "nokey":
                        print("  [INFO] Para tener una URL FIJA permanente sin rotación:")
                        print("         Registra gratis tu clave en https://admin.localhost.run")
                        print("         (Tu clave pública está en %USERPROFILE%\\.ssh\\id_ed25519.pub)")
                    print("=" * 68)
                    print("  >> Mantén esta ventana abierta mientras compartas el curso. <<")
                    print("  >> Para detenerlo, presiona Ctrl+C o cierra esta ventana. <<")
                    print("=" * 68 + "\n", flush=True)

            tunnel_proc.wait()
            print("[!] El túnel se cerró. Reconectando en 3 segundos...", flush=True)
        except Exception as e:
            print(f"[!] Error en túnel: {e}. Reintentando en 3 segundos...", flush=True)
        time.sleep(3)

if __name__ == "__main__":
    main()
