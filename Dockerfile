# Estágio 1: Build da aplicação React
FROM node:18-alpine AS build

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de definição de dependências
# Isso aproveita o cache do Docker. Se esses arquivos не mudarem,
# o passo de 'npm install' não será executado novamente.
COPY package.json ./
COPY package-lock.json ./

# Instala as dependências
RUN npm install

# Copia o resto do código da aplicação
COPY . .

# Executa o script de build para gerar os arquivos de produção
RUN npm run build

# Estágio 2: Servidor de produção (Nginx)
FROM nginx:stable-alpine

# Copia os arquivos estáticos gerados no Estágio 1 para a pasta pública do Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Para que o roteamento do React (React Router) funcione corretamente,
# é necessário configurar o Nginx. Copiaremos um arquivo de configuração customizado.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 80, que é a porta padrão do Nginx
EXPOSE 80

# Comando para iniciar o servidor Nginx
CMD ["nginx", "-g", "daemon off;"]