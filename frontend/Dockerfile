FROM node:22-alpine AS test
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ENTRYPOINT ["npm", "run", "test:ci"]

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY . /usr/share/nginx/html
EXPOSE 80