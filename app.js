const messaging = firebase.messaging();
messaging.onTokenRefresh(() => {
  messaging.getToken().then((refreshedToken) => {
    setTokenSentToServer(false);
    sendTokenToServer(refreshedToken);
    resetUI();
  }).catch((err) => {
    showToken('Unable to retrieve refreshed token ', err);
  });
});
messaging.onMessage((payload) => {
  appendMessage(payload);
})

function resetUI() {
  clearMessages();
  showToken('loading...');
  messaging.getToken().then((currentToken) => {
    if (currentToken) {
      sendTokenToServer(currentToken);
    } else {
      showToken('No Instance ID token available. Request permission to generate one.');
      setTokenSentToServer(false);
    }
  }).catch((err) => {
    showToken('Error retrieving Instance ID token. ' + err);
    setTokenSentToServer(false);
  });
}
function showToken(currentToken) {
  var tokenElement = document.querySelector('#token');
  tokenElement.textContent = currentToken;
}
// Send the Instance ID token your application server, so that it can:
// - send messages back to this app
// - subscribe/unsubscribe the token from topics
function sendTokenToServer(currentToken) {
  if (!isTokenSentToServer()) {
    console.log('Sending token to server...');
    setTokenSentToServer(true);
  }
}
function isTokenSentToServer() {
  return window.localStorage.getItem('sentToServer') === '1';
}
function setTokenSentToServer(sent) {
  window.localStorage.setItem('sentToServer', sent ? '1' : '0');
}

function requestPermission() {
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      resetUI();
    }
  });
}
function deleteToken() {
  // Delete Instance ID token.
  // [START delete_token]
  messaging.getToken().then((currentToken) => {
    messaging.deleteToken(currentToken).then(() => {
      setTokenSentToServer(false);
      resetUI();
    }).catch((err) => {
      console.log('Unable to delete token. ', err);
    });
  }).catch((err) => {
    showToken('Error retrieving Instance ID token. ' + err);
  });
}
// Add a message to the messages element.
function appendMessage(payload) {
  const messagesElement = document.querySelector('#messages');
  const dataHeaderELement = document.createElement('h5');
  const dataElement = document.createElement('pre');
  dataElement.style = 'overflow-x:hidden;';
  dataHeaderELement.textContent = 'Received message:';
  dataElement.textContent = JSON.stringify(payload, null, 2);
  messagesElement.appendChild(dataHeaderELement);
  messagesElement.appendChild(dataElement);
}
// Clear the messages element of all children.
function clearMessages() {
  const messagesElement = document.querySelector('#messages');
  while (messagesElement.hasChildNodes()) {
    messagesElement.removeChild(messagesElement.lastChild);
  }
}

resetUI();
