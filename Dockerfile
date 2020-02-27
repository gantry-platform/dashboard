# Stage 1
FROM node:alpine AS app-dashboard
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
ARG BUILD
RUN npm run $BUILD

# Stage 2
FROM nginx:alpine
COPY --from=app-dashboard /app/dist/dashboard /usr/share/nginx/html
EXPOSE 80