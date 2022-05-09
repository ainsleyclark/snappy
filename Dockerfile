FROM node:18-alpine3.14

# Create app directory
WORKDIR /app

# Install Chromium
RUN apk add --no-cache  chromium --repository=http://dl-cdn.alpinelinux.org/alpine/v3.10/main
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV CHROMIUM_PATH /usr/bin/chromium-browser

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
