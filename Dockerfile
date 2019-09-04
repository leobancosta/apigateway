FROM node:8.6-alpine
RUN echo "building image"
EXPOSE 3000
CMD ["npm", "start"]