FROM node:22-alpine
WORKDIR /app
COPY package*.json nest-cli.json tsconfig*.json ./
RUN npm install
COPY libs ./libs
COPY apps/gateway ./apps/gateway
RUN npx nest build gateway
CMD ["node", "dist/apps/gateway/apps/gateway/src/main"]
