FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install -g pnpm

RUN pnpm i

COPY . .

CMD ["pnpm", "start:tsc"]
