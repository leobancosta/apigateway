FROM node:lts
RUN echo "building image	!!!!"

WORKDIR /usr/src/app
COPY package.json .

RUN echo "installing packages image"
RUN npm install

RUN chmod 777 node_modules/.bin/mocha
RUN npm uninstall mocha && npm i mocha

COPY . .
EXPOSE 8080

RUN echo "starting npm"
CMD ["npm", "start"]