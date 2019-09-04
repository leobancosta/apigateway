FROM node:8.6-alpine

RUN mkdir /home/jenkins/apigateway
WORKDIR /home/jenkins/apigateway

COPY package.json /home/jenkins/apigateway/
RUN npm install

COPY . /home/jenkins/apigateway/

EXPOSE 3000
CMD ["npm", "start"]