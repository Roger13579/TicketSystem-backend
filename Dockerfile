FROM node:latest
ENV TZ=Asia/Taipei
RUN ln -snf /usr/share/zoneinfo/${TZ} /etc/localtime && echo ${TZ} > /etc/timezone
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm run swagger
EXPOSE 3000
CMD ["npm","start"]