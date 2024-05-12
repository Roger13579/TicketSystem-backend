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
    }
  }
}

export {};
