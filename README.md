# vue-people

> vue people

## Fronted Build Setup

``` bash
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

# generate static project
$ yarn generate
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

## Backend build setup

```bash
# Build docker service with docker-compose
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
 docker pull deliverous/certbot

# Obtain the certificates
 docker run -it --rm -v /home/$(whoami)/vue-people/nginx/certs:/etc/letsencrypt:rw -v /home/$(whoami)/vue-people/nginx/certs-data:/data/letsencrypt:rw  deliverous/certbot  certonly --webroot --webroot-path=/data/letsencrypt -d $DOMAIN

# copy the certbot certs:
 sudo cp /home/$(whoami)/vue-people/nginx/certs/live/$DOMAIN/privkey.pem /home/$(whoami)/vue-people/nginx/certs/key.pem
 sudo cp /home/$(whoami)/vue-people/nginx/certs/live/$DOMAIN/fullchain.pem /home/$(whoami)/vue-people/nginx/certs/chain.pem
 sudo cp /home/$(whoami)/vue-people/nginx/certs/live/$DOMAIN/cert.pem /home/$(whoami)/vue-people/nginx/certs/cert.pem

# own the certificates:
 sudo chown $(whoami):$(whoami) cert.pem chain.pem key.pem

# refresh certificates
 docker run -it --rm -v /home/$(whoami)/vue-people/nginx/certs:/etc/letsencrypt:rw -v /home/$(whoami)/vue-people/nginx/certs-data:/data/letsencrypt:rw  deliverous/certbot renew --webroot --webroot-path=/data/letsencrypt -d $DOMAIN

```