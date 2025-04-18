FROM node:21.7.3

WORKDIR /home/node/

COPY package*.json ./

RUN npm install

COPY . ./

RUN npm run build

EXPOSE 3000

CMD ["node", "src/dist/app.js"]
