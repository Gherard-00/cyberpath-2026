import subprocess
import re
import time
import threading
import urllib.request
import sys
import os

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

def keep_alive_worker():
    global current_url
    while not stop_event.is_set():
        # Ping every 60 seconds to prevent inactivity timeout
        for _ in range(60):
            if stop_event.is_set():
                return
            time.sleep(1)
        if current_url:
            try:
                req = urllib.request.Request(
                    current_url,
                    headers={'User-Agent': 'CyberPath-Tunnel-KeepAlive/1.0'}
                )
                with urllib.request.urlopen(req, timeout=10) as resp:
                    pass
            except Exception:
                pass

def main():
    global current_url
    base_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(base_dir)
    url_file = os.path.join(base_dir, "tunnel_url.txt")

    t = threading.Thread(target=keep_alive_worker, daemon=True)
    t.start()

    while not stop_event.is_set():
        print("[*] Iniciando túnel SSH con localhost.run...", flush=True)
        try:
            proc = subprocess.Popen(
                TUNNEL_CMD,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                bufsize=1
            )
            for line in proc.stdout:
                sys.stdout.write(line)
                sys.stdout.flush()
                match = re.search(r'https://[a-zA-Z0-9\-]+\.lhr\.life', line)
                if match:
                    current_url = match.group(0)
                    print(f"\n[+] URL PÚBLICA ACTIVA: {current_url}\n", flush=True)
                    with open(url_file, "w", encoding="utf-8") as f:
                        f.write(current_url)

            proc.wait()
            print("[!] El túnel se cerró. Reconectando en 3 segundos...", flush=True)
        except Exception as e:
            print(f"[!] Error en túnel: {e}. Reintentando en 3 segundos...", flush=True)
        time.sleep(3)

if __name__ == "__main__":
    main()
