FROM node:20-alpine3.23
WORKDIR /app
COPY package.json ./
COPY index.js ./
CMD ["node", "index.js"]