FROM node:16.16.0
WORKDIR /backend/
COPY . /backend/
RUN npm install
EXPOSE 7000