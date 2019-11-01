FROM node:10

LABEL maintainer="Sathit Seethaphon <dixonsatit@gmail.com>"

WORKDIR /app

COPY . .

RUN npm i

CMD ["npm", "start"]