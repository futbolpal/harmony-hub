FROM heroku/heroku:16

RUN apt-get update
RUN apt-get install -y nodejs
RUN apt-get install -y npm

RUN mkdir -p /app/user
WORKDIR /app/user

COPY package-lock.json .
COPY package.json .
RUN npm install

COPY . .
