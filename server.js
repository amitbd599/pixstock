const { createServer } = require("http");
const next = require("next");
const app = next({ dev: false, hostname: "127.0.0.1", port: 3000 });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    for (const k of [
      "origin",
      "x-forwarded-host",
      "x-forwarded-proto",
      "x-forwarded-port",
    ]) {
      const v = req.headers[k];
      if (typeof v === "string" && v.includes(",")) {
        console.log(`[fix-header] ${k}: ${v}`);
        req.headers[k] = v.split(",")[0].trim();
      }
    }
    handle(req, res);
  }).listen(3000, "127.0.0.1", () => console.log("PixStock ready on 3000"));
});
