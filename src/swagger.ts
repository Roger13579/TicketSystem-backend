import swagger_autogen from 'swagger-autogen';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerDefinition from './swagger-definition';
const swaggerAutogen = swagger_autogen();

const doc = {
  info: {
    title: 'Movie Go',
    description: 'This is the project for a Node.js course.',
  },
  host: process.env.FRONTEND_URL,
  schemes: ['http', 'https'],
  tags: [
    { name: 'Home', description: '首頁' },
    { name: 'Sign-in', description: '登入相關' },
    { name: 'Account', description: '會員管理' },
    { name: 'Notifications', description: '系統通知' },
    { name: 'Payment', description: '金流串接' },
    { name: 'NotFound', description: '頁面路由相關' },
  ],
  securityDefinitions: {
    // Token
    Bearer: {
      type: 'apiKey',
      in: 'header', // can be "header", "query" or "cookie"
      name: 'Authorization', // name of the header, query parameter or cookie
      description: 'JWT Token',
    },
  },
  swaggerDefinition,
};

const options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Node.js and typescript with Swagger',
      version: '1.0.0',
      description: 'Movie Go Ticket Manage System',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./routes/*.ts'],
};

const spec = swaggerJsdoc(options);

const outputFile = '../swagger-output.json';
const routes = ['src/routes/*.ts']; // 進入點/注入點，分析 router 和自動生成

swaggerAutogen(outputFile, routes, doc).then(() => {
  console.log('swagger document generate success');
});

export default spec;
