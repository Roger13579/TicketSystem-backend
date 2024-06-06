import swagger_autogen from 'swagger-autogen';
import { customDefinitions, definitions } from './definition';

const swaggerAutogen = swagger_autogen();

const doc = {
  info: {
    title: 'Movie Go',
    description: 'This is the project for a Node.js course.',
  },
  host: process.env.FRONTEND_URL,
  basePath: '/api',
  schemes: ['http', 'https'],
  tags: [
    { name: 'Home', description: '首頁' },
    { name: 'Sign-in', description: '登入相關' },
    { name: 'Account', description: '會員管理' },
    { name: 'Product', description: '商品相關' },
    { name: 'Ticket', description: '票券相關' },
    { name: 'Order', description: '訂單相關' },
    { name: 'Group', description: '揪團' },
    { name: 'Admin', description: '後台管理' },
    { name: 'Upload', description: '上傳檔案' },
    { name: 'User', description: '使用者相關' },
    { name: 'Cart', description: '使用者購物車' },
    { name: 'Comment', description: '評論' },
    { name: 'Tag', description: '標籤' },
  ],
  definitions,
  '@definitions': customDefinitions,
  securityDefinitions: {
    // Token
    Bearer: {
      type: 'apiKey',
      in: 'header', // can be "header", "query" or "cookie"
      name: 'Authorization', // name of the header, query parameter or cookie
      description: 'JWT Token',
    },
  },
};

const outputFile = '../swagger-output.json';
const routes = ['src/routes/*.ts']; // 進入點/注入點，分析 router 和自動生成

swaggerAutogen(outputFile, routes, doc).then(() => {
  // eslint-disable-next-line no-console
  console.log('swagger document generate success');
});
