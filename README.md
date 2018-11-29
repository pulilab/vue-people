# vue-people

> VuePeople lists and connects Vue.JS developers around the world.

## Status

CircleCi: [![CircleCI](https://circleci.com/gh/pulilab/vue-people/tree/master.svg?style=svg)](https://circleci.com/gh/pulilab/vue-people/tree/master)

## Fronted Build Setup

``` bash
$ cd frontend

# install dependencies
$ yarn install

# copy .env.template in .env
$ cp .env.template .env

# add API key to .env as described in the template

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start
```

## Specific Dev environment configurations
> NEVER RUN THIS ON THE PRODUCTION SERVER

```bash
# Copy dummy self signed certs to Nginx folder:
$ cp nginx/dev_certs/cert.pem nginx/certs/cert.pem
$ cp nginx/dev_certs/chain.pem nginx/certs/chain.pem
$ cp nginx/dev_certs/key.pem nginx/certs/key.pem

# Tell node to ignore self signed certificate:
$ echo "NODE_TLS_REJECT_UNAUTHORIZED = '0'" >> .env
```

```bash
# start django in debug mode
change DEBUG=True in django/.env
```

## Backend build setup

```bash
# Build docker service with docker-compose
$ cd django
$ cp .env.template .env

$ cd ..
$ docker-compose build
$ docker-compose up -d

# Perform standard django initialization
$ docker-compose exec django python manage.py migrate
$ docker-compose exec django python manage.py createsuperuser
```

## Deploy

Deploy is done by CircleCi, manual deploy can be performed on a docker-compose enabled unix machine as follow:

```bash

git clone git@github.com:pulilab/vue-people.git
$ cd vue-people
$ docker-compose build
$ docker-compose up -d

```

## SSL certificates

```bash
# Set the Domain variable
 export DOMAIN=NAME_OF_THE_DOMAIN

# Pull the docker image for certbot:
 docker pull certbot/certbot

# Obtain the certificates
 docker run -it --rm -v /home/$(whoami)/vue-people/nginx/certs:/etc/letsencrypt:rw -v /home/$(whoami)/vue-people/nginx/certs-data:/data/letsencrypt:rw  deliverous/certbot  certonly --webroot --webroot-path=/data/letsencrypt -d $DOMAIN

# copy the certbot certs:
 sudo cp /home/$(whoami)/vue-people/nginx/certs/live/$DOMAIN/privkey.pem /home/$(whoami)/vue-people/nginx/certs/key.pem
 sudo cp /home/$(whoami)/vue-people/nginx/certs/live/$DOMAIN/fullchain.pem /home/$(whoami)/vue-people/nginx/certs/chain.pem
 sudo cp /home/$(whoami)/vue-people/nginx/certs/live/$DOMAIN/cert.pem /home/$(whoami)/vue-people/nginx/certs/cert.pem

# own the certificates:
 sudo chown $(whoami):$(whoami) /home/$(whoami)/vue-people/nginx/certs/key.pem
 sudo chown $(whoami):$(whoami) /home/$(whoami)/vue-people/nginx/certs/chain.pem
 sudo chown $(whoami):$(whoami) /home/$(whoami)/vue-people/nginx/certs/cert.pem

# refresh certificates
 docker run -it --rm -v /home/$(whoami)/vue-people/nginx/certs:/etc/letsencrypt:rw -v /home/$(whoami)/vue-people/nginx/certs-data:/data/letsencrypt:rw  certbot/certbot renew --webroot --webroot-path=/data/letsencrypt

```

## License

[MIT](https://github.com/pulilab/vue-people/blob/master/LICENSE)


## How to contribute:

- fork the repo
- clone the repo
- `cd vue-people/frontend && yarn`
- `yarn dev`
- `cp .env.template .env`
- edit `.env` and: 
-- add `NODE_TLS_REJECT_UNAUTHORIZED = '0'` 
-- add `WEBSOCKET_PROTOCOL=ws`
-- modify `host` to `host=0.0.0.0`
- `cd ../django/ && cp .env.template .env`
- add a random long strin under SECRET_KEY in django/.env
- `cd.. && docker-compose build`
- `docker-compose up -d`
- `docker-compose exec django python manage.py migrate`
- `docker-compose exec django python manage.py createsuperuser` and follow the prompt to generate an admin user
- go to `locahost/admin` and login with the created credentials
- in the admin:
  - Go to sites -> add site -> fill the two input with `localhost`
  - Go to social accounts/social applications -> add social application
  - fill with: provider: GitHub | name: Github | ClientId: XXX  | Secret Key: XXXX
  - to obtain ClientID and Secret Key follow this guide: https://developer.github.com/apps/building-oauth-apps/creating-an-oauth-app/
  - Homepage url is: `http://localhost` and callback url is: `http://localhost/accounts/github/login/callback/` 
- code :D
- commit and create a PR from your fork to this repo

