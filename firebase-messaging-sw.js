importScripts('https://www.gstatic.com/firebasejs/6.3.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/6.3.0/firebase-messaging.js');

var firebaseConfig = {
  apiKey: "AIzaSyB6Bpsn0kvA4Q5gGSpEymINBdEnYCWlY2Y",
  authDomain: "sasi-ui.firebaseapp.com",
  databaseURL: "https://sasi-ui.firebaseio.com",
  projectId: "sasi-ui",
  storageBucket: "sasi-ui.appspot.com",
  messagingSenderId: "586894582158",
  appId: "1:586894582158:web:5421158ba5688af4"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Customize notification handler
messaging.setBackgroundMessageHandler(function(payload) {
  console.log('Handling background message', payload);

  // Copy data object to get parameters in the click handler
  payload.data.data = JSON.parse(JSON.stringify(payload.data));
  return self.registration.showNotification(payload.data.title, payload.data);
});

self.addEventListener('notificationclick', function(event) {
  const target = event.notification.data.click_action || '/';
  event.notification.close();

  // This looks to see if the current is already open and focuses if it is
  event.waitUntil(clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  }).then(function(clientList) {
    // clientList always is empty?!
    for (var i = 0; i < clientList.length; i++) {
      var client = clientList[i];
      if (client.url === target && 'focus' in client) {
        return client.focus();
      }
    }

    return clients.openWindow(target);
  }));
})
