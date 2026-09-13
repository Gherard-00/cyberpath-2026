import http.server
import urllib.request
import urllib.error
import os

PORT = int(os.environ.get("PORT", 8000))
HOST = os.environ.get("HOST", "127.0.0.1")
OLLAMA_URL = "http://127.0.0.1:11434"
MAX_PAYLOAD_SIZE = 5 * 1024 * 1024  # 5 MB max payload

class ProxyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def is_allowed_path(self, path):
        clean_path = path.split('?')[0].split('#')[0]
        if clean_path in ['/', '/index.html', '/styles.css', '/script.js', '/quiz.js', '/favicon.svg', '/robots.txt']:
            return True
        if clean_path.startswith('/lecciones/'):
            return True
        return False

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, HEAD')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200, "OK")
        self.end_headers()

    def do_GET(self):
        if not self.is_allowed_path(self.path):
            self.send_error(403, "Acceso denegado a archivos internos")
            return
        super().do_GET()

    def do_HEAD(self):
        if not self.is_allowed_path(self.path):
            self.send_error(403, "Acceso denegado a archivos internos")
            return
        super().do_HEAD()

    def do_POST(self):
        # Strict route filtering: Only allow /api/chat
        clean_path = self.path.split('?')[0].rstrip('/')
        if clean_path != '/api/chat':
            self.send_error(404, "Endpoint no permitido")
            return

        content_length = int(self.headers.get('Content-Length', 0))
        if content_length > MAX_PAYLOAD_SIZE:
            self.send_error(413, "Payload demasiado grande")
            return

        post_data = self.rfile.read(content_length)

        req = urllib.request.Request(
            f"{OLLAMA_URL}/api/chat",
            data=post_data,
            headers={'Content-Type': 'application/json'},
            method='POST'
        )

        try:
            with urllib.request.urlopen(req, timeout=180) as resp:
                self.send_response(resp.status)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Cache-Control', 'no-cache')
                self.end_headers()

                while True:
                    chunk = resp.read(1024)
                    if not chunk:
                        break
                    self.wfile.write(chunk)
                    self.wfile.flush()
        except urllib.error.HTTPError as e:
            self.send_response(e.code)
            self.end_headers()
            self.wfile.write(e.read())
        except urllib.error.URLError:
            self.send_response(504)
            self.end_headers()
            self.wfile.write(b'{"error": "Timeout o error de conexion con el servicio de Ollama"}')
        except Exception as e:
            self.send_response(500)
            self.end_headers()
            self.wfile.write(str(e).encode('utf-8'))

if __name__ == "__main__":
    web_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(web_dir)
    
    # ThreadingHTTPServer evita que el streaming de la IA bloquee la carga de assets u otras pestañas
    httpd = http.server.ThreadingHTTPServer((HOST, PORT), ProxyHTTPRequestHandler)
    print(f"Servidor CyberPath Multihilo corriendo de forma segura en http://{HOST}:{PORT}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
