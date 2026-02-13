import { firebaseApp } from "../config";

interface OptionsSendNotification {
  title: string;
  body: string;
  url: string;
  tokens: string[];
}

export class PushNotificationService {
  async send({ title, body, url, tokens }: OptionsSendNotification) {
    const message = {
      tokens,
      webpush: {
        notification: {
          title,
          requireInteraction: true,
        },
        fcmOptions: {
          link: url,
        },
      },
      android: {
        notification: {
          title,
          body,
        },
      },
      notification: {
        title,
        body,
      },
      data: {
        url,
      },
    };

    await firebaseApp.messaging().sendEachForMulticast(message);
  }
}
