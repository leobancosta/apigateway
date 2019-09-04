FROM node:8.6-alpine
RUN echo "building image"
RUN echo "starting npm"
EXPOSE 80
CMD ["npm", "start"]