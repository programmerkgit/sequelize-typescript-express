FROM node:latest
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
ENV NODE_ENV=dev PORT=3000
EXPOSE 3000
CMD [ "npm", "run", "start" ]
