FROM node:12

# создание директории приложения
WORKDIR /usr/src/app

# установка зависимостей
COPY package*.json ./
RUN npm install

# копируем исходный код
COPY . .

ENTRYPOINT [ "node", "src/server.js" ]
EXPOSE 8080