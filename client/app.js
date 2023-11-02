const loginForm = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');
const messageText = document.getElementById('message-text')
let userName = '';

const socket = io();
socket.on('message', ({ author, content }) => addMessage(author, content));
socket.on('logout', (author) => addMessage('chat bot', author + ' has left the conversation... :('));

const login = (e) => {
  e.preventDefault();
  if (userNameInput.value === '') {
    alert('login');
  } else {
    userName = userNameInput.value;
    socket.emit('userLogin', userName);
    socket.emit('message', { author: 'chat bot', content: userName + ' has joined the conversation!' })
    loginForm.classList.remove('show');
    messagesSection.classList.add('show');
  }
};

const sendMessage = (e) => {
  e.preventDefault();

  let messageContent = messageContentInput.value;

  if (messageContentInput.value === '') {
    alert('add message');
  } else {
    addMessage(userName, messageContent);
    socket.emit('message', { author: userName, content: messageContent })
    messageContentInput.value = '';
  }
};

const addMessage = (author, content) => {
  const message = document.createElement('li');
  message.classList.add('message');
  message.classList.add('message--received');
  if (author === userName) message.classList.add('message--self');
  message.innerHTML = `
    <h3 class="message__author">${userName === author ? 'You' : author}</h3>
    <div class="message__content">
      ${content}
    </div>
    `;
  if (author === 'chat bot') {
    message.innerHTML = `
    <h3 class="message__author">${userName === author ? 'You' : author}</h3>
    <div class="message__content chatBot">
      ${content}
    </div>
    `;
  }
  messagesList.appendChild(message);
};

loginForm.addEventListener('submit', login);
addMessageForm.addEventListener('submit', sendMessage)

