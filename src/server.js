import http from "http";
import WebShoket from "ws";
import express from "express";

const app = express();

// File Settings
app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => res.render("home"));

// app.listen(3000, () => {
//     console.log("Server is running at http://localhost:3000");
// });

const server = http.createServer(app); // http 모듈을 사용하여 서버 생성
const wss = new WebShoket.Server({ server }); // http 서버를 WebSocket에 전달 (두 프로토콜이 같은 포트 공유)

const sockets = [];

// WebSocket 서버 Event Handling
wss.on("connection", (socket) => {
    socket["nickname"] = "Anonymous";
    sockets.push(socket);
    console.log("Connected to Client");

    socket.on("close", () => {
        const idx = sockets.indexOf(socket);
        if (idx > -1) sockets.splice(idx, 1); // 연결 종료된 소켓을 배열에서 제거

        console.log("Disconnected from Client");
    });

    socket.on("message", (message) => {
        const parsed = JSON.parse(message.toString('utf-8'));

        switch (parsed.type) {
            case "new_message":
                sockets.forEach((aSocket) => {
                    aSocket.send(`${socket.nickname}: ${parsed.payload}`);
                });
                break;
            case "nickname":
                socket["nickname"] = parsed.payload;
                break;
        }
    });
});

server.listen(3000, () => {
    console.log("Server is running at http://localhost:3000");
});