FROM node:20.8.0-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./index.js /usr/src/app/
ENV NODE_ENV production
ENV PORT 80
EXPOSE 80
CMD node index.js
