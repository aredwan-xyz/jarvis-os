from __future__ import annotations

import json
import mimetypes
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

from jarvis_core import AGENTS, WORKFLOWS, route_intent
from jarvis_core.demo_data import APPROVALS, AUDIT_EVENTS, COSTS, INTEGRATIONS, search_memories


ROOT = Path(__file__).resolve().parents[1]
HOST = "127.0.0.1"
PORT = 4173


def json_response(handler: BaseHTTPRequestHandler, payload: object, status: int = 200) -> None:
    body = json.dumps(payload, indent=2).encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json")
    handler.send_header("Content-Length", str(len(body)))
    handler.end_headers()
    handler.wfile.write(body)


def read_json(handler: BaseHTTPRequestHandler) -> dict[str, object]:
    length = int(handler.headers.get("Content-Length", "0"))
    if length == 0:
        return {}
    return json.loads(handler.rfile.read(length).decode("utf-8"))


class JarvisHandler(BaseHTTPRequestHandler):
    def do_HEAD(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path.startswith("/api/"):
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            return
        self.serve_static(parsed.path, include_body=False)

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path == "/api/health":
            json_response(self, {"status": "ok", "service": "jarvis-core"})
            return
        if parsed.path == "/api/agents":
            json_response(self, [agent.__dict__ for agent in AGENTS])
            return
        if parsed.path == "/api/workflows":
            json_response(self, [workflow.__dict__ for workflow in WORKFLOWS])
            return
        if parsed.path == "/api/approvals":
            json_response(self, APPROVALS)
            return
        if parsed.path == "/api/audit":
            json_response(self, AUDIT_EVENTS)
            return
        if parsed.path == "/api/integrations":
            json_response(self, INTEGRATIONS)
            return
        if parsed.path == "/api/costs":
            json_response(self, COSTS)
            return
        if parsed.path == "/api/memory/search":
            query = parse_qs(parsed.query).get("q", [""])[0]
            json_response(self, search_memories(query))
            return

        self.serve_static(parsed.path)

    def do_POST(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path == "/api/route":
            payload = read_json(self)
            message = str(payload.get("message", ""))
            if not message.strip():
                json_response(self, {"error": "message is required"}, 400)
                return
            json_response(self, route_intent(message).to_dict())
            return

        json_response(self, {"error": "not found"}, 404)

    def serve_static(self, request_path: str, include_body: bool = True) -> None:
        safe_path = request_path.strip("/") or "index.html"
        target = (ROOT / safe_path).resolve()
        if not str(target).startswith(str(ROOT)) or not target.exists() or target.is_dir():
            target = ROOT / "index.html"

        body = target.read_bytes()
        content_type = mimetypes.guess_type(target.name)[0] or "application/octet-stream"
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        if include_body:
            self.wfile.write(body)

    def log_message(self, format: str, *args: object) -> None:
        return


def run() -> None:
    server = ThreadingHTTPServer((HOST, PORT), JarvisHandler)
    print(f"JARVIS Mission Control running at http://{HOST}:{PORT}")
    server.serve_forever()


if __name__ == "__main__":
    run()
