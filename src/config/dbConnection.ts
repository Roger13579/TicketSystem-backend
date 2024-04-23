import { connect } from 'mongoose';
import env from 'dotenv';
import log4js from './log4js';
const logger = log4js.getLogger(`initConnection`);

const connection = async () => {
  env.config();
  try {
    const mongoDbUrl = process.env.MONGO_DB_URL || 'mongodb://localhost:27017';
    logger.info(mongoDbUrl);
    await connect(mongoDbUrl);
    logger.info('mongo db connection initialized');
  } catch (err) {
    logger.error('mongo do connection initialize fail', err);
    process.exit(1);
  }
};

export default connection;
