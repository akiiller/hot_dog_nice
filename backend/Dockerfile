# Dockerfile para o Backend (Exemplo com Node.js)
FROM node:18-alpine

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm install

COPY . .

# Expõe a porta que sua API está usando (ex: 3001)
EXPOSE 3001

CMD ["npm", "start"]