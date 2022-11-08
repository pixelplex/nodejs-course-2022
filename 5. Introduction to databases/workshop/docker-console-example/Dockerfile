FROM node:12

# создание директории приложения
WORKDIR /usr/src/app

# установка зависимостей
COPY package*.json ./
RUN npm install

# копируем исходный код
COPY . .

#CMD node "src/index.js"
ENTRYPOINT [ "node", "src/index.js" ]
CMD ["Tatsiana"]
