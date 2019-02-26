'use strict';
const connection = new WebSocket('wss://neto-api.herokuapp.com/mouse');
document.addEventListener('click', sendCoord);

connection.addEventListener('open', (event) => {
  showBubbles(event.target);
});

function sendCoord(event) {
  const coord = { 'x' : event.clientX, 'y' : event.clientY };
  connection.send(JSON.stringify(coord));
};