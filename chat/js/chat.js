'use strict';
const chat = document.querySelector('.chat'),
      chatStatus = chat.querySelector('.chat-status'),
      sendMsgBtn = chat.querySelector('.message-submit'),
      msgInput = chat.querySelector('.message-input'),
      msgContent = document.querySelector('.messages-content'),
      connection = new WebSocket('wss://neto-api.herokuapp.com/chat');

const msgTemps = chat.querySelector('.messages-templates'),
      msgLoading = msgTemps.children[0],
      msgFriend = msgTemps.children[1],
      msgPersonal = msgTemps.children[2],
      msgStatus = msgTemps.children[3];
      

connection.addEventListener('open', event => {
  chatStatus.innerHTML = chatStatus.dataset.online;
  sendMsgBtn.removeAttribute('disabled');
  let msg = msgStatus.cloneNode(true)
  msgContent.appendChild(msg);
  msgContent.lastChild.innerHTML = 'Пользователь появился в сети';
});

connection.addEventListener('error', makeOff);

connection.addEventListener('message', event => {
  if (event.data === '...') {
    msgContent.appendChild(msgLoading);
  } else {
    if (msgContent.lastChild.classList.contains('loading')) {
      msgContent.removeChild(msgContent.lastChild)
    };
    
    let msg = msgFriend.cloneNode(true)
    msgContent.appendChild(msg); 
    msgContent.lastChild.querySelector('.message-text').innerHTML = event.data;
    msgContent.lastChild.querySelector('.timestamp').innerHTML = getCurrentTime();
  };
});

connection.addEventListener('close', makeOff);

msgInput.addEventListener('keypress', event => {
  if (event.key === 'Enter') {
    event.preventDefault();
    sendMsg();
  };
});

sendMsgBtn.addEventListener('click', sendMsg);

function sendMsg() {
  if (event.target === sendMsgBtn) event.preventDefault();
  
  while (msgContent.children.length > 6) {
    msgContent.removeChild(msgContent.firstChild);
  };
  
  if (msgInput.value) {
    let msg = msgPersonal.cloneNode(true);
    msgContent.appendChild(msg);
    msgContent.lastChild.querySelector('.message-text').innerHTML = msgInput.value;
    msgContent.lastChild.querySelector('.timestamp').innerHTML = getCurrentTime();
    connection.send(msgInput.value);
    msgInput.value = '';
  };
};

function getCurrentTime() {
  const date = new Date(),
        hours = date.getHours(),
        minutes = date.getMinutes();
  if (hours < 10 && minutes < 10) return '0' + hours + ':0' + minutes;
  if (hours < 10) return '0' + hours + ':' + minutes;
  if (minutes < 10) return hours + ':0' + minutes;
  return hours + ':' + minutes;
};

function makeOff() {
  chatStatus.innerHTML = chatStatus.dataset.offline;
  sendMsgBtn.setAttribute('disabled', 'disabled');
  let msg = msgStatus.cloneNode(true);
  msgContent.appendChild(msg);
  msgContent.lastChild.innerHTML = 'Пользователь не в сети';
};