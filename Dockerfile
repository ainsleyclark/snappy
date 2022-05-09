FROM node:18-alpine3.14

# Create app directory
WORKDIR /app

# Set enviornment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"

# Setup Chromium
RUN set -x \
    && apk update \
    && apk upgrade \
    && apk add --no-cache \
    udev \
    ttf-freefont \
    chromium \
    && npm install puppeteer@1.10.0

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Install deps
RUN npm install

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "npm", "run", "start" ]
