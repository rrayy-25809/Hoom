import http from "http";
import SocketIO from "socket.io";
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
const io = SocketIO(server)

io.on("connection", socket => {
    socket.on("enter_room", (msg, done) => {
        console.log(msg);
        setTimeout(done, 10000)
    })
});

server.listen(3000, () => {
    console.log("Server is running at http://localhost:3000");
});