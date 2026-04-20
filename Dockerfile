# FROM node:20-alpine

# WORKDIR /app

# COPY package*.json ./
# RUN npm install

# COPY . .

# EXPOSE 5173

# CMD ["npm", "run", "dev", "--", "--host"]


# ─────────────────────────────
# 1. Build stage
# ─────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build


# ─────────────────────────────
# 2. Production stage (Nginx)
# ─────────────────────────────
FROM nginx:alpine

# remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# copy built React files
COPY --from=build /app/dist /usr/share/nginx/html

# custom nginx config (optional but recommended)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]