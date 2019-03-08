FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN ["npm", "install", "-g", "mongodb"]
RUN ["npm", "install", "-g", "nodemon"]

CMD ["nodemon" , "ws.js"]

EXPOSE 3000
