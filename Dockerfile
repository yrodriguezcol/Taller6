# Use a Node.js base image
FROM node:18-alpine

# Set the working directory
WORKDIR /usr/scr/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install\
&& npm install typescript

# Copy the source code to the working directory
COPY . .

# Set the command to start the app
CMD [ "npm","run","dev" ]