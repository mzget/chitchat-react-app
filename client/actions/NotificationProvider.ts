

export namespace NotificationProvider {
    export type NotiMessage = { title: string; body: string; image: string; }
    export class NotificationAPI {
        private static instance: NotificationAPI;
        public static getInstance(): NotificationAPI {
            return NotificationAPI.instance;
        }
        public static createInstance() {
            if (!NotificationAPI.instance) {
                NotificationAPI.instance = new NotificationAPI();
            }

            return NotificationAPI.instance;
        }

        constructor() {
            Notification.requestPermission(function (status) {
                // status is "granted", if accepted by user
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