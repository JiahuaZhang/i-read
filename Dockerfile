# Use the official Node.js 18 image as a parent image
FROM node:22-alpine as build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of your app's source code
COPY . .

# Build your app
RUN npm run build

# Use a smaller base image for the final stage
FROM node:22-alpine

WORKDIR /app

# Copy built assets from the build stage
COPY --from=build /app/build ./build
COPY --from=build /app/public ./public
COPY --from=build /app/package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Start the app
CMD ["npm", "run", "start"]