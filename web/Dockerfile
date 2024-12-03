FROM node:21.7.3

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 5173

CMD ["npx", "serve", "-s", "dist", "-l", "5173"]
