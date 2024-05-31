declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      MONGO_DB_URL: string;
      GOOGLE_OAUTH_CLIENT_ID: string;
      GOOGLE_OAUTH_CLIENT_SECRET: string;
      GOOGLE_OAUTH_CALLBACK_URL: string;
      JWT_SECRETS: string;
      JWT_EXPIRES: string;
      JWT_EMAIL_EXPIRES: string;
      FRONTEND_URL: string;
      GMAIL_USER: string;
      GMAIL_PASS: string;
      FIREBASE_TYPE: string;
      FIREBASE_PROJECT_ID: string;
      FIREBASE_PRIVATE_KEY: string;
      FIREBASE_CLIENT_EMAIL: string;
      FIREBASE_CLIENT_ID: string;
      FIREBASE_AUTH_URI: string;
      FIREBASE_TOKEN_URI: string;
      FIREBASE_AUTH_PROVIDER_X509_CERT_URL: string;
      FIREBASE_CLIENT_X509_CERT_URL: string;
      JWT_REFRESH_EXPIRES: string;
      NEWEBPAY_PAY_GATEWAY: string;
      NEWEBPAY_VERSION: string;
      NEWEBPAY_MERCHANT_ID: string;
      NEWEBPAY_NOTIFY_URL: string;
      HASHKEY: string;
      HASHIV: string;
      RETURN_URL: string;
      LINEPAY_CHANNEL_ID: string;
      LINEPAY_VERSION: string;
      LINEPAY_RETURN_HOST: string;
      LINEPAY_RETURN_CONFIRM_URL: string;
      LINEPAY_RETURN_CANCEL_URL: string;
      LINEPAY_CHANNEL_SECRET_KEY: string;
      LINEPAY_SITE: string;
    }
  }
}

export {};
