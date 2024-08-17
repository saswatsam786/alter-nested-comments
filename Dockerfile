# Use the official Node.js 18 image
FROM node:18

# Create and set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the port on which the app will run
EXPOSE 6005

# Start the app
CMD ["node", "dist/server.js"]
