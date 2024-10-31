# Stage 1: Installing dependencies
FROM node:18 AS install-dependencies

WORKDIR /usr/src/app

COPY package.json package-lock.json tsconfig.json ./

# Use Yarn to install dependencies
RUN npm install

COPY . .

# Stage 2: Creating a build
FROM node:18 AS create-build

WORKDIR /usr/src/app

# Copy the built application from the previous stage
COPY --from=install-dependencies /usr/src/app ./

# Build the application using Yarn
RUN npm run build

# Stage 3: Running the application with Puppeteer
FROM node:18 AS run

WORKDIR /usr/src/app

# Copy the built application from the previous stage
COPY --from=create-build /usr/src/app/dist ./dist
COPY .env package.json tsconfig.json ./

# Build the application using Yarn
RUN npm install

# Use a shell command to run the application
CMD ["npm", "run", "start:prod"]
