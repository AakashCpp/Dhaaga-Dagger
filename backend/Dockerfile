FROM node:20-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY src ./src
COPY api ./api
EXPOSE 5000
CMD ["npm", "start"]
