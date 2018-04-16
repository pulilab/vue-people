FROM node:8.11.1-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app/
RUN echo "NODE_ENV=production" >> .env
RUN yarn
RUN yarn build

# start command
CMD [ "yarn", "start" ]

