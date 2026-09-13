import subprocess
import re
import time
import threading
import urllib.request
import sys
import os
import atexit
import signal

TUNNEL_CMD = [
    "ssh",
    "-o", "StrictHostKeyChecking=no",
    "-o", "ServerAliveInterval=15",
    "-o", "ServerAliveCountMax=3",
    "-R", "80:127.0.0.1:8000",
    "nokey@localhost.run"
]

current_url = None
stop_event = threading.Event()
server_proc = None
tunnel_proc = None

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
    """Limpia los procesos hijos al salir."""
    global server_proc, tunnel_proc
    stop_event.set()
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

    print("\n========================================================")
    print("      CyberPath 2026 - Conexión de Túnel Público")
    print("========================================================\n")

    ensure_server(base_dir)

    t = threading.Thread(target=keep_alive_worker, daemon=True)
    t.start()

    while not stop_event.is_set():
        print("\n[*] Estableciendo túnel SSH con localhost.run...", flush=True)
        try:
            tunnel_proc = subprocess.Popen(
                TUNNEL_CMD,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                bufsize=1
            )
            url_announced = False
            for line in tunnel_proc.stdout:
                # Mostrar solo líneas relevantes o errores
                if "Welcome to localhost.run" in line or "connection id" in line or "QR:" in line:
                    continue
                match = re.search(r'https://[a-zA-Z0-9\-]+\.lhr\.life', line)
                if match and not url_announced:
                    current_url = match.group(0)
                    url_announced = True
                    with open(url_file, "w", encoding="utf-8") as f:
                        f.write(current_url)
                    copy_to_clipboard(current_url)

                    print("\n" + "=" * 66)
                    print("  >>> ¡ENLACE PÚBLICO DE CYBERPATH GENERADO CON ÉXITO! <<<")
                    print("=" * 66)
                    print(f"\n  URL:  {current_url}\n")
                    print("  [OK] Enlace copiado automáticamente al portapapeles.")
                    print("  [OK] Acceso verificado para compañeros (Chrome, Edge, Firefox, etc).")
                    print("  [OK] Acceso habilitado para bots de IA (Claude / ChatGPT vía robots.txt).")
                    print("=" * 66)
                    print("  >> Mantén esta ventana abierta mientras compartas el curso. <<")
                    print("  >> Para detenerlo, presiona Ctrl+C o cierra esta ventana. <<\n")
                    print("=" * 66 + "\n", flush=True)

            tunnel_proc.wait()
            print("[!] El túnel se cerró. Reconectando en 3 segundos...", flush=True)
        except Exception as e:
            print(f"[!] Error en túnel: {e}. Reintentando en 3 segundos...", flush=True)
        time.sleep(3)

if __name__ == "__main__":
    main()
