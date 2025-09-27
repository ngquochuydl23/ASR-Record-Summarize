FROM node:lts AS development

COPY package.json /app/yarn.lock
RUN yarn install

WORKDIR /app
COPY . /app

RUN yarn build


FROM development AS build
FROM nginx:alpine
COPY --from=build /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf
WORKDIR /usr/share/nginx/html

RUN rm -rf ./*
COPY --from=build /app/build .
ENTRYPOINT ["nginx", "-g", "daemon off;"]
