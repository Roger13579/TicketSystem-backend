import { connect } from 'mongoose';
import env from 'dotenv';
import log4js from './log4js';
const logger = log4js.getLogger(`initConnection`);
env.config();

const connection = async () => {
  try {
    const mongoDbUrl =
      process.env.MONGO_DB_URL || 'mongodb://localhost:27017/test';
    await connect(mongoDbUrl);
    logger.info('mongo db connection initialized');
  } catch (err) {
    logger.error('mongo do connection initialize fail', err);
    process.exit(1);
  }
};

export default connection;
