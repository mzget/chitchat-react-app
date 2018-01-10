export var NotificationAPI;
(function (NotificationAPI) {
    class NotificationFactory {
        constructor() {
            console.log("Notification.permission", Notification.permission);
            Notification.requestPermission(function (status) {
                if (Notification.permission !== status) {
                    Notification.permission = status;
                }
            });
        }
        static getInstance() {
            return NotificationFactory.instance;
        }
        static createInstance() {
            if (!NotificationFactory.instance) {
                NotificationFactory.instance = new NotificationFactory();
            }
            return NotificationFactory.instance;
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
    NotificationAPI.NotificationFactory = NotificationFactory;
})(NotificationAPI || (NotificationAPI = {}));
