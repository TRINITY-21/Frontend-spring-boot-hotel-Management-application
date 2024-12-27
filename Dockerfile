FROM node:18-alpine

WORKDIR /app
 
# Install dependencies separately to leverage caching
COPY package*.json ./

RUN npm install
 
# Copy the rest of the application code
COPY . .
# RUN npm run build

EXPOSE 7070
CMD ["npm", "start"]