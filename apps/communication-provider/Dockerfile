FROM node:22-alpine
WORKDIR /app
COPY package*.json nest-cli.json tsconfig*.json ./
RUN npm install
COPY libs ./libs
COPY apps/communication-provider ./apps/communication-provider
RUN npx nest build communication-provider
CMD ["node", "dist/apps/communication-provider/main"]
