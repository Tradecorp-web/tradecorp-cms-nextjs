importScripts('https://www.gstatic.com/firebasejs/8.6.8/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.6.8/firebase-messaging.js');

var config = {
  apiKey: "AIzaSyD3fzUNdadV3wJjXLd0j00_CRTwJbIfjlw",
  authDomain: "tci-trucking.firebaseapp.com",
  databaseURL: "https://tci-trucking.firebaseio.com",
  projectId: "tci-trucking",
  storageBucket: "tci-trucking.appspot.com",
  messagingSenderId: "921358057258",
  appId: "1:921358057258:web:b8b613a6ded5db0ade6853",
  measurementId: "G-LTTV5G3BYY"
};
firebase.initializeApp(config);

const messaging = firebase.messaging()

messaging.setBackgroundMessageHandler(function(payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
    image: payload.notification.image,
    click_action: payload.notification.click_action,
    data: {
      click_action: payload.notification.click_action
    }
  };

  self.addEventListener('notificationclick', function(event) {
    //console.log(event.notification.data.click_action);
    if (!event.action) {
      // Was a normal notification click
      //console.log('Notification Click.');
      self.clients.openWindow(event.notification.click_action, '_blank')
      event.notification.close();
      return;
    } else {
      event.notification.close();
    }
  });
  
  return self.registration.showNotification(notificationTitle,
      notificationOptions);
});
