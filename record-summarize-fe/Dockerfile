FROM node:lts AS development
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

WORKDIR /app
COPY . /app

RUN npm run build


FROM development AS build
FROM nginx:alpine
COPY --from=build /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf
WORKDIR /usr/share/nginx/html

RUN rm -rf ./*
COPY --from=build /app/build .
ENTRYPOINT ["nginx", "-g", "daemon off;"]
