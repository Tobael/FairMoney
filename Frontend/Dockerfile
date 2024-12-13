# Node.js runtime as build image
FROM node:22-alpine

# Set the working directory in the container
WORKDIR /app

# Copy app to the working directory
COPY . ./

# Install dependencies
RUN npm ci

# Build the React application
RUN npm run build

# Nginx image to serve the React application
FROM nginx

# Copy the build output to the Nginx HTML directory
COPY --from=0 /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY docker/default.conf /etc/nginx/conf.d/default.conf
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Set permissions for non-root user
RUN chown -R 1001:1001 /var/cache/nginx && \
        chown -R 1001:1001 /var/log/nginx && \
        chown -R 1001:1001 /etc/nginx/conf.d
RUN touch /var/run/nginx.pid && \
        chown -R 1001:1001 /var/run/nginx.pid

# Set permissions for non-root user
USER 1001

# Expose port 80
EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]
