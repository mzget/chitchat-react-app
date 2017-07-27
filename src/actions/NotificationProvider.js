export var NotificationProvider;
(function (NotificationProvider) {
    class NotificationAPI {
        constructor() {
            Notification.requestPermission(function (status) {
                // status is "granted", if accepted by user
            });
        }
        static getInstance() {
            return NotificationAPI.instance;
        }
        static createInstance() {
            if (!NotificationAPI.instance) {
                NotificationAPI.instance = new NotificationAPI();
            }
            return NotificationAPI.instance;
        }
        nativeNotifyAPI(message) {
            if (Notification && Notification.permission !== "denied") {
                Notification.requestPermission(function (status) {
                    let myNotification = new Notification(message.title, {
                        body: message.body,
                        icon: message.image
                    });
                    myNotification.onclick = () => {
                        console.log('Notification clicked');
                    };
                });
            }
        }
    }
    NotificationProvider.NotificationAPI = NotificationAPI;
})(NotificationProvider || (NotificationProvider = {}));
