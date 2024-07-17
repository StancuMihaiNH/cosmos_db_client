# Use an official Node.js image as the base
FROM node:14

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application files
COPY . .

# Build the React app
RUN npm run build

# Install a simple static file server to serve the built app
RUN npm install -g serve

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Start the app using the static file server
CMD ["serve", "-s", "build"]