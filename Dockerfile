# FROM  balenalib/raspberrypi3-node:12-latest-build
# WORKDIR /usr/src/app
# COPY . /usr/src/app
# # RUN npm install serverless
# RUN npm install
# RUN npm run build
# ENV SLS_DEBUG=*

# RUN sls package

FROM  balenalib/armv7hf-node:12-latest-build
RUN [ "cross-build-start" ]
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
ENV AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
ENV AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install serverless -g
RUN npm install
ENV SLS_DEBUG=*

RUN sls deploy 

RUN [ "cross-build-end" ]
