# Stage 1: Build the React app
FROM node:alpine AS builder

WORKDIR /app
COPY . .

RUN yarn install
RUN yarn build

# Stage 2: Nginx setup
FROM nginx:alpine

WORKDIR /usr/share/nginx/html
# Remove default nginx static assets
RUN rm -rf ./*

COPY --from=builder /app/dist .

CMD ["nginx", "-g", "daemon off;"]
