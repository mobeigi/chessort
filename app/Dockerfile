# Stage 1: Build the React app
FROM node:alpine AS builder

WORKDIR /app
COPY . .

# Ensure .env binary present as its required during the build
RUN test -f .env || { echo "Error: .env file is required!" && exit 1; }

RUN yarn install
RUN yarn build

# Stage 2: Nginx setup
FROM nginx:alpine

WORKDIR /usr/share/nginx/html
# Remove default nginx static assets
RUN rm -rf ./*

COPY --from=builder /app/dist .

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
