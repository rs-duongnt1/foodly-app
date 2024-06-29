import { NODE_ENV } from 'src/constants/app.constant';
import type { Config } from './config.interface';
import { config as configDotEnv } from 'dotenv';

configDotEnv();
const configs = (): Config => {
  return {
    app: {
      name: process.env.APP_NAME || 'APP NAME',
      nodeEnv: (process.env.NODE_ENV as NODE_ENV) || NODE_ENV.PRODUCTION,
      port: +process.env.APP_PORT || 3333,
      fallbackLanguage: process.env.APP_FALLBACK_LANGUAGE || 'en',
      headerLanguage: process.env.APP_HEADER_LANGUAGE || 'x-custom-lang',
      redisHost: process.env.REDIS_HOST || 'localhost',
      redisPort: parseInt(process.env.REDIS_PORT) || 6379,
    },
    database: {
      url: process.env.DATABASE_URL,
    },
    jwt: {
      accessSecret: process.env.JWT_ACCESS_SECRET,
      refreshSecret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN,
      refreshIn: process.env.JWT_REFRESH_IN,
    },
    aws: {
      region: process.env.AWS_REGION || 'ap-southeast-1',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      s3BucketName: process.env.AWS_S3_BUCKET_NAME,
    },
    mail: {
      host: process.env.SMTP_HOST || 'localhost',
      port: parseInt(process.env.SMTP_PORT, 10) || 1025,
      secure: process.env.SMTP_SECURE === 'true',
      ignoreTLS: process.env.SMTP_SECURE !== 'false',
      auth: {
        user: process.env.SMTP_AUTH_USER || 'username',
        pass: process.env.SMTP_AUTH_PASS || 'password',
      },
      queue: {
        name: 'email-queue',
      },
    },
  };
};

export default configs;
