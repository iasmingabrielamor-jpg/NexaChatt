const path = require("path");
const http = require("http");
const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true, app: "NexaChat" });
});

io.on("connection", (socket) => {
  socket.emit("system", "Conectado ao NexaChat.");

  socket.on("message:send", (text) => {
    if (typeof text !== "string") return;
    const clean = text.trim().slice(0, 500);
    if (!clean) return;

    io.emit("message:new", {
      text: clean,
      time: new Date().toISOString()
    });
  });
});

const PORT = Number(process.env.PORT) || 10000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`NexaChat online na porta ${PORT}`);
});
