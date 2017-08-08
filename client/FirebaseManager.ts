import * as firebase from "firebase";

export namespace FirebaseManager {
    export class Firebase {
        firebaseApp: firebase.app.App;
        swRegistration;
        isSubscribed;
        applicationServerPublicKey = "AAAAjSd2z44:APA91bGiZJtMhSpEzIuaGZTCuZqAHjgVZHLWHKGshzMuHgOwciyD9PYdT0jZg4ts9He9h-8zl-S9sfpTPRLVWbrvJqoH7cxToyKfoibq47C7pz0KLvpZI3DZCQHnn99XAIme2si2n3jT";
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

        constructor() {
            // Initialize Firebase
            // TODO: Replace with your project's customized code snippet
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

        initToken() {
            // Retrieve an instance of Firebase Messaging so that it can handle background
            // messages.
            const messaging = firebase.messaging();
            // Handle incoming messages. Called when:
            // - a message is received while the app has focus
            // - the user clicks on an app notification created by a sevice worker
            //   `messaging.setBackgroundMessageHandler` handler.
            messaging.onMessage(function (payload) {
                console.log("Message received. ", payload);
            });
            messaging.requestPermission().then(function () {
                console.log('Notification permission granted.');
                // TODO(developer): Retrieve an Instance ID token for use with FCM.

                messaging.getToken().then(function (currentToken) {
                    if (currentToken) {
                        console.log("currentToken", currentToken)
                        // updateUIForPushEnabled(currentToken);
                    } else {
                        // Show permission request.
                        console.log('No Instance ID token available. Request permission to generate one.');
                        // Show permission UI.

                        // updateUIForPushPermissionRequired();
                        // setTokenSentToServer(false);
                    }
                }).catch(function (err) {
                    console.log('An error occurred while retrieving token. ', err);
                });

                // Callback fired if Instance ID token is updated.
                messaging.onTokenRefresh(function () {
                    messaging.getToken().then(function (refreshedToken) {
                        console.log('Token refreshed.', refreshedToken);
                        // Indicate that the new Instance ID token has not yet been sent to the
                        // app server.
                        // setTokenSentToServer(false);
                        // Send Instance ID token to app server.
                        // sendTokenToServer(refreshedToken);                            
                    }).catch(function (err) {
                        console.log('Unable to retrieve refreshed token ', err);
                        // showToken('Unable to retrieve refreshed token ', err);
                    });
                });
            }).catch(function (err) {
                console.log('Unable to get permission to notify.', err);
            });
        }

        initialiseUI(registration: ServiceWorkerRegistration) {
            let self = this;
            self.swRegistration = registration;
            if (this.isSubscribed) {
                // TODO: Unsubscribe user
            } else {
                self.subscribeUser();
            }

            // Set the initial subscription value
            self.swRegistration.pushManager.getSubscription().then(function (subscription) {
                self.isSubscribed = !(subscription === null);

                self.updateSubscriptionOnServer(subscription);

                if (self.isSubscribed) {
                    console.log('User IS subscribed.');
                } else {
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
            // TODO: Send subscription to application server


            console.log("subscription", subscription);
        }
    }
}