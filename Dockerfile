FROM node:16
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 4000
ENTRYPOINT ["npm", "start"]
