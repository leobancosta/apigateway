FROM node:8.6-alpine
 
RUN mkdir -p /home/jenkins/apigateway
WORKDIR /home/jenkins/apigateway
 
COPY package.json /home/jenkins/apigateway/
RUN npm install
 
COPY . .
 
EXPOSE 3000
CMD ["npm", "start"]