FROM oven/bun:1.0.4-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./index.js /usr/src/app/
ENV NODE_ENV production
ENV PORT 80
EXPOSE 80
CMD bun run index.js
