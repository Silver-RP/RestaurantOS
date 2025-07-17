# Stage build với Node.js
FROM node:20.14.0-alpine AS build

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy các file package và khóa package
COPY package*.json ./

# Cài đặt dependencies với npm ci để đảm bảo consistency
RUN npm ci --silent

# Copy toàn bộ mã nguồn
COPY . .

# Build ứng dụng với Vite và TypeScript
RUN npm run build

# Stage phục vụ với Nginx
FROM nginx:1.27.3-alpine

# Cài đặt curl cho healthcheck
RUN apk add --no-cache curl

# Copy file build từ stage trước vào thư mục nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Cấu hình Nginx để hỗ trợ routing cho Single Page Application
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s \
  CMD curl -f http://localhost || exit 1

# Khởi động Nginx
CMD ["nginx", "-g", "daemon off;"]
