FROM node:22-alpine
WORKDIR /app
COPY package*.json nest-cli.json tsconfig*.json ./
RUN npm install
COPY libs ./libs
COPY apps/identity-property ./apps/identity-property
RUN npx nest build identity-property
CMD ["node", "dist/apps/identity-property/apps/identity-property/src/main"]
