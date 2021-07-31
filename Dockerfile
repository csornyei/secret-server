FROM node:16-alpine

WORKDIR /app

COPY package*.json .

RUN npm install --silent --only=prod

COPY . .

CMD ["npm", "start"]