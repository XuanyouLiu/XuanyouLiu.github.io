import http.server
import socketserver
import os

PORT = 8000

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Get the absolute path on the filesystem
        path = self.translate_path(self.path)
        
        # If the path is a directory, let the parent class handle it (index.html or listing)
        if os.path.isdir(path):
            super().do_GET()
            return

        # If the file exists, serve it
        if os.path.exists(path):
            super().do_GET()
        else:
            # If file doesn't exist, serve 404.html with 404 status code
            self.path = '/404.html'
            # We explicitly set the status in the response, but do_GET calls send_response(200) for the file it finds.
            # To strictly serve 404 status with 404.html content is trickier with SimpleHTTPRequestHandler.
            # For a visual preview, just serving the content is enough.
            super().do_GET()

print(f"Starting custom server at http://localhost:{PORT}")
print("This server will show 404.html for missing pages.")

# Allow address reuse to avoid "Address already in use" errors if we restart quickly
socketserver.TCPServer.allow_reuse_address = True

with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
