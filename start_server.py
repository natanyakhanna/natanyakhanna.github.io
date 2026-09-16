import http.server
import socketserver

PORT = 8080
DIRECTORY = 'H:/Antigravity Projects/Natanya Portfolio Website'

class MyHttpRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        self.directory = DIRECTORY
        return http.server.SimpleHTTPRequestHandler.do_GET(self)

with socketserver.TCPServer(('', PORT), MyHttpRequestHandler) as httpd:
    print(f'Serving at port {PORT}')
    httpd.serve_forever()
