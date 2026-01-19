# 1. Base image
FROM node:20-alpine

# 2. App directory inside container
WORKDIR /app

# 3. Copy package files
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy rest of the code
COPY . .

# 6. Expose port (change if needed)
EXPOSE 3000

# 7. Start the app
CMD ["node", "index.js"]
