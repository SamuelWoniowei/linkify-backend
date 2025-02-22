
FROM node:18-bullseye

WORKDIR /

COPY package*.json ./
RUN npm install --omit=dev
COPY . .
EXPOSE 8000

CMD ["node", "index.js"]  