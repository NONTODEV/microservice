FROM node:20-alpine

WORKDIR /microservice/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8080

CMD ["node", "./dist/apps/books-microservice/main", "./dist/apps/users-microservice/main", "./dist/apps/web-microservice/main", "./dist/apps/dashboard-microservice/main"]
