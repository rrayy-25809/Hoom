const socket = io();

const welcome = document.getElementById('welcome');
const form = welcome.querySelector('form');
const room = document.getElementById('room');

room.hidden = true;

let roomName;

function addMessage(msg) {
  const ul = room.querySelector('ul');
  const li = document.createElement('li');
  li.innerText = msg;
  ul.appendChild(li);
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector('h3');
  h3.innerText = `Room: ${roomName}`;
  const form = room.querySelector('form');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = room.querySelector('input');
    socket.emit('new_message', input.value, roomName, () => {
      addMessage(`You: ${input.value}`);
      input.value = '';
    });
  });
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const roominput = form.querySelector('#roomname');
  const nameinput = form.querySelector('#name');
  roomName = roominput.value;
  socket.emit('nickname', nameinput.value);
  socket.emit('enter_room', roomName, showRoom);
  input.value = '';
});

socket.on('welcome', (user, newCount) => {
  const h3 = room.querySelector('h3');
  h3.innerText = `Room ${roomName} (${newCount})`;
  addMessage(`${user} arrived!`);
});

socket.on('bye', (left, newCount) => {
  const h3 = room.querySelector('h3');
  h3.innerText = `Room ${roomName} (${newCount})`;
  addMessage(`${left} left ㅠㅠ`);
});

socket.on('new_message', addMessage);

socket.on('room_change', (rooms) => {
  roomList.innerHTML = '';
  const roomList = welcome.querySelector('ul');
  if (rooms.length != 0) {
    rooms.forEach((room) => {
      const li = document.createElement('li');
      li.innerHTML = room;
      roomList.appendChild(li);
    });
  }
});
