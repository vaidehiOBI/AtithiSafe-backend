FROM node:22-alpine
WORKDIR /app
COPY package*.json nest-cli.json tsconfig*.json ./
RUN npm install
COPY libs ./libs
COPY apps/safety-operations ./apps/safety-operations
RUN npx nest build safety-operations
CMD ["node", "dist/apps/safety-operations/main"]
