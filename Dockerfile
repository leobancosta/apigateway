FROM node:lts
RUN echo "building image    !!!!"

WORKDIR /usr/src/app
COPY package.json .

RUN echo "installing packages image"
RUN npm install

COPY . .
EXPOSE 8080

RUN echo "starting npm"
CMD ["npm", "start"]