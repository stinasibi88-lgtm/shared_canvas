const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const galleries = new Map();

app.use(express.json());
app.use(express.static(path.join(__dirname, "../FRONTEND")));

function createRoomCode() {
    let code;

    do {
        code = "SC" + Math.floor(1000 + Math.random() * 9000);
    } while (galleries.has(code));

    return code;
}

app.post("/api/galleries", function(req, res) {
    const name = String(req.body.name || "My Shared Gallery").trim();
    const code = createRoomCode();

    galleries.set(code, {
        name: name || "My Shared Gallery",
        users: new Set()
    });

    res.status(201).json({
        code,
        name: galleries.get(code).name
    });
});

app.post("/api/galleries/join", function(req, res) {
    const code = String(req.body.code || "").trim().toUpperCase();
    const gallery = galleries.get(code);

    if (!gallery) {
        return res.status(404).json({
            error: "Gallery not found"
        });
    }

    res.json({ code, name: gallery.name });
});

io.on("connection", function(socket) {
    socket.on("join-gallery", function(data) {
        const room = String(data.room || "").trim().toUpperCase();
        const gallery = galleries.get(room);

        if (!gallery) {
            return;
        }

        socket.join(room);
        socket.data.room = room;
        socket.data.avatar = data.avatar === "male" ? "male" : "female";
        gallery.users.add(socket.id);

        socket.to(room).emit("player-joined", {
            id: socket.id,
            avatar: socket.data.avatar
        });
    });

    socket.on("chat-message", function(text) {
        const room = socket.data.room;
        const message = String(text || "").trim();

        if (room && message) {
            io.to(room).emit("chat-message", {
                sender: socket.data.avatar || "Guest",
                text: message
            });
        }
    });

    socket.on("player-move", function(position) {
        const room = socket.data.room;

        if (room && Number.isFinite(position.x) && Number.isFinite(position.y)) {
            socket.to(room).emit("player-move", {
                id: socket.id,
                x: position.x,
                y: position.y,
                avatar: socket.data.avatar
            });
        }
    });

    socket.on("disconnect", function() {
        const room = socket.data.room;
        const gallery = galleries.get(room);

        if (gallery) {
            gallery.users.delete(socket.id);
        }

        if (room) {
            socket.to(room).emit("player-left", socket.id);
        }
    });
});

const port = process.env.PORT || 3000;

server.listen(port, function() {
    console.log(`Shared Canvas is running at http://localhost:${port}`);
});