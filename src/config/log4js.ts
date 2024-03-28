import log4js from 'log4js';

const config = {
  appenders: {
    info: {
      type: 'console',
    },
  },
  categories: {
    default: { appenders: ['info'], level: 'info' },
  },
};

log4js.configure(config);
export default log4js;
