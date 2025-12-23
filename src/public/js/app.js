const messageList = document.querySelector("ul");
const nicknameForm = document.getElementById("nickname");
const messageForm = document.getElementById("message");
const socket = new WebSocket(`ws://${window.location.host}`); // Connection

function makeMessage(type, payload){
    const msg = {type, payload};
    return JSON.stringify(msg);
}

socket.addEventListener("open", () => {
    console.log("Connected to Server");
});

socket.addEventListener("message", (message) => {
    // console.log("New Message: ", message.data);
    const li = document.createElement("li");
    li.innerText = message.data;
    messageList.append(li)
});

socket.addEventListener("close", () => {
    console.log("Disconnected from Server");
});

messageForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = messageForm.querySelector("input");
    const li = document.createElement("li");
    li.innerText = `You: ${input.value}`;
    messageList.append(li)
    socket.send(makeMessage("new_message", input.value));
    input.value = "";
});

nicknameForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = nicknameForm.querySelector("input");
    socket.send(makeMessage("nickname", input.value));
});