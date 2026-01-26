import http.server
import socketserver
import os
import sys

PORT = 8000

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        path = self.translate_path(self.path)
        
        # If it is a directory, let default handler deal with it
        if os.path.isdir(path):
            super().do_GET()
            return

        # If file exists, serve it
        if os.path.exists(path):
            super().do_GET()
        else:
            # File not found, serve 404.html with 404 status
            try:
                # Check if 404.html exists
                error_page_path = os.path.join(os.getcwd(), '404.html')
                if os.path.exists(error_page_path):
                    self.send_response(404)
                    self.send_header('Content-type', 'text/html')
                    self.end_headers()
                    with open(error_page_path, 'rb') as f:
                        self.wfile.write(f.read())
                else:
                    # Fallback if 404.html is missing
                    self.send_error(404, "File not found")
            except Exception as e:
                print(f"Error serving 404 page: {e}")
                self.send_error(404, "File not found")

# Set allow_reuse_address to True to avoid 'Address already in use'
socketserver.TCPServer.allow_reuse_address = True

print(f"Starting custom server at http://localhost:{PORT}")
try:
    with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
        httpd.serve_forever()
except OSError as e:
    if e.errno == 48:
        print(f"Port {PORT} is already in use. Please kill the existing process.")
    else:
        raise
