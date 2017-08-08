import * as firebase from "firebase";
export var FirebaseManager;
(function (FirebaseManager) {
    class Firebase {
        constructor() {
            this.applicationServerPublicKey = "AAAAjSd2z44:APA91bGiZJtMhSpEzIuaGZTCuZqAHjgVZHLWHKGshzMuHgOwciyD9PYdT0jZg4ts9He9h-8zl-S9sfpTPRLVWbrvJqoH7cxToyKfoibq47C7pz0KLvpZI3DZCQHnn99XAIme2si2n3jT";
            let config = {
                apiKey: "AIzaSyBdlnYQ6Aymnn8gjVpXfoKt73BZ0qDFiRE",
                authDomain: "chitchat-1ee07.firebaseapp.com",
                databaseURL: "https://chitchat-1ee07.firebaseio.com",
                projectId: "chitchat-1ee07",
                storageBucket: "chitchat-1ee07.appspot.com",
                messagingSenderId: "606252486542"
            };
            this.firebaseApp = firebase.initializeApp(config);
        }
        urlB64ToUint8Array(base64String) {
            const padding = '='.repeat((4 - base64String.length % 4) % 4);
            const base64 = (base64String + padding)
                .replace(/\-/g, '+')
                .replace(/_/g, '/');
            const rawData = window.atob(base64);
            const outputArray = new Uint8Array(rawData.length);
            for (let i = 0; i < rawData.length; ++i) {
                outputArray[i] = rawData.charCodeAt(i);
            }
            return outputArray;
        }
        initToken() {
            const messaging = firebase.messaging();
            messaging.onMessage(function (payload) {
                console.log("Message received. ", payload);
            });
            messaging.requestPermission().then(function () {
                console.log('Notification permission granted.');
                messaging.getToken().then(function (currentToken) {
                    if (currentToken) {
                        console.log("currentToken", currentToken);
                    }
                    else {
                        console.log('No Instance ID token available. Request permission to generate one.');
                    }
                }).catch(function (err) {
                    console.log('An error occurred while retrieving token. ', err);
                });
                messaging.onTokenRefresh(function () {
                    messaging.getToken().then(function (refreshedToken) {
                        console.log('Token refreshed.', refreshedToken);
                    }).catch(function (err) {
                        console.log('Unable to retrieve refreshed token ', err);
                    });
                });
            }).catch(function (err) {
                console.log('Unable to get permission to notify.', err);
            });
        }
        initialiseUI(registration) {
            let self = this;
            self.swRegistration = registration;
            if (this.isSubscribed) {
            }
            else {
                self.subscribeUser();
            }
            self.swRegistration.pushManager.getSubscription().then(function (subscription) {
                self.isSubscribed = !(subscription === null);
                self.updateSubscriptionOnServer(subscription);
                if (self.isSubscribed) {
                    console.log('User IS subscribed.');
                }
                else {
                    console.log('User is NOT subscribed.');
                }
            });
        }
        subscribeUser() {
            let self = this;
            const applicationServerKey = self.urlB64ToUint8Array(self.applicationServerPublicKey);
            self.swRegistration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: applicationServerKey
            })
                .then(function (subscription) {
                console.log('User is subscribed.');
                self.updateSubscriptionOnServer(subscription);
                self.isSubscribed = true;
            })
                .catch(function (err) {
                console.log('Failed to subscribe the user: ', err);
            });
        }
        updateSubscriptionOnServer(subscription) {
            console.log("subscription", subscription);
        }
    }
    FirebaseManager.Firebase = Firebase;
})(FirebaseManager || (FirebaseManager = {}));
