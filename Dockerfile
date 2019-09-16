FROM node:8.6-alpine
RUN echo "building image !!!!"

WORKDIR /usr/src/app
COPY package.json .

RUN echo "installing packages image"
RUN npm install
RUN npm install -g mocha

COPY . .
EXPOSE 8080

RUN echo "starting npm"
CMD ["npm", "start"]