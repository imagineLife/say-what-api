FROM node:16.13-alpine as dev-dependencies

WORKDIR /server
# COPY files & directories from host into image
COPY package.json package-lock.json index.js webpack.config.js ./
COPY db/ db/
COPY global/ global/
COPY helpers/ helpers/
COPY middleware/ middleware/
COPY routes/ routes/
COPY server-setup/ server-setup/

RUN npm i
RUN npm i -g nodemon
USER node
EXPOSE 3000

CMD ["nodemon", "."]