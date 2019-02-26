'use strict';
const connection = new WebSocket('wss://neto-api.herokuapp.com/counter'),
      counter = document.querySelector('.counter'),
      errors = document.querySelector('.errors');

connection.addEventListener('message', event => {
  let data;
  try {
    data = JSON.parse(event.data)
  } catch(e) {
    console.log('Not valid JSON');
    return;
  };
  counter.innerHTML = data.connections;
  errors.innerHTML = data.errors;
});

window.addEventListener('beforeunload', () => {
  connection.close(1000, 'Close tab');
});
