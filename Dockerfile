FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# ให้สิทธิ์รัน script
RUN chmod +x wait-for-it.sh

CMD ["./wait-for-it.sh", "mysql:3306", "--", "node", "index.js"]
