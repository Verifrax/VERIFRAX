import http from "http";
import { execute } from "./execute";
import { RunRequest } from "./protocol";
import { verifyDistributed } from "../engine/verify";

export const startServer = ({ port = 3333 }) => {
  const server = http.createServer((req, res) => {
    if (req.method === "GET" && req.url === "/health") {
      res.writeHead(200);
      return res.end("OK");
    }

    if (req.method === "GET" && req.url === "/verify") {
      res.writeHead(200);
      res.end("ENGINE_ALIVE");
      return;
    }

    if (req.method === "POST" && req.url === "/consensus") {
      let body = "";
      req.on("data", c => (body += c));
      req.on("end", () => {
        try {
          const { results, sig, pubkeys } = JSON.parse(body);
          const receipt = verifyDistributed(results, "verifrax-engine", sig, pubkeys);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(receipt));
        } catch (e) {
          console.error("CONSENSUS_VIOLATION", e);
          process.exit(1);
        }
      });
      return;
    }

    if (req.method === "POST" && req.url === "/run") {
      let body = "";
      req.on("data", c => (body += c));
      req.on("end", async () => {
        const parsed: RunRequest = JSON.parse(body || "{}");
        if (!("input" in parsed)) {
          res.writeHead(400);
          return res.end("INVALID_REQUEST");
        }
        const result = await execute(parsed.input);
        res.writeHead(200, {
          "Content-Type": "application/json",
          "X-Verifrax-Receipt": result.receipt?.commitment ?? ""
        });
        res.end(JSON.stringify(result));
      });
      return;
    }
    res.writeHead(404);
    res.end();
  });

  server.listen(port, () =>
    console.log(`Verifrax engine listening on ${port}`)
  );
};

