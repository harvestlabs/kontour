FROM node:16.13.1

RUN apt-get update && apt-get install -y \
	rsync \
	libpq-dev \
	git \
	vim \
	redis-tools \
	default-mysql-client \
	lsof

RUN npm i -g pm2 kill-port solc

COPY ./package.json /usr/src/app/
COPY ./scripts/ /usr/src/app/scripts/
WORKDIR /usr/src/app
COPY ./yarn.lock /usr/src/app/
RUN yarn
COPY . /usr/src/app/
RUN yarn run build

RUN echo 'alias mysqlsh="mysql --host=$MYSQL_HOST --user=$MYSQL_USER --port=$MYSQL_PORT --password=$MYSQL_PASSWORD $MYSQL_DATABASE"' >> ~/.bashrc
RUN echo 'alias redissh="redis-cli -h $REDIS_HOST -p $REDIS_PORT"' >> ~/.bashrc

EXPOSE 8080
ENTRYPOINT yarn run start:prod