

export namespace NotificationAPI {
    export type NotiMessage = { title: string; body: string; image: string; }
    export class NotificationFactory {
        private static instance: NotificationFactory;
        public static getInstance(): NotificationFactory {
            return NotificationFactory.instance;
        }
        public static createInstance() {
            if (!NotificationFactory.instance) {
                NotificationFactory.instance = new NotificationFactory();
            }

            return NotificationFactory.instance;
        }

        constructor() {
            console.log("Notification.permission", Notification.permission);

            Notification.requestPermission(function (status) {
                if (Notification.permission !== status) {
                    Notification.permission = status;
                }
            });
        }

        nativeNotifyAPI(message: NotiMessage) {
            if (Notification && Notification.permission !== "denied") {
                Notification.requestPermission(function (status) {  // status is "granted", if accepted by user
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
}