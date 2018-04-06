# vue-people

> vue people

## Build Setup

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

# Pull the docker image for certbot:
$ docker pull deliverous/certbot

# Obtain the certificates
$ docker run -it --rm -v /home/USERNAME/vue-people/nginx/certs:/etc/letsencrypt:rw -v /home/USERNAME/vue-people/nginx/certs-data:/data/letsencrypt:rw  deliverous/certbot  certonly --webroot --webroot-path=/data/letsencrypt -d DOMAIN

# copy the certbot certs:
$ sudo cp /home/USERNAME/vue-people/nginx/certs/live/DOMAIN/privkey.pem /home/USERNAME/vue-people/nginx/certs/key.pem
$ sudo cp /home/USERNAME/vue-people/nginx/certs/live/DOMAIN/fullchain.pem /home/USERNAME/vue-people/nginx/certs/chain.pem
$ sudo cp /home/USERNAME/vue-people/nginx/certs/live/DOMAIN/cert.pem /home/USERNAME/vue-people/nginx/certs/cert.pem

# own the certificates:
$ sudo chown people:people cert.pem chain.pem key.pem

# refresh certificates
$ docker run -it --rm -v /home/USERNAME/vue-people/nginx/certs:/etc/letsencrypt:rw -v /home/USERNAME/vue-people/nginx/certs-data:/data/letsencrypt:rw  deliverous/certbot renew --webroot --webroot-path=/data/letsencrypt -d DOMAIN

```