# --- Estágio 1: Build ---
# Use a imagem do Node para construir a aplicação
FROM node:18-alpine AS builder

WORKDIR /app

# Copia os arquivos de dependência e instala
COPY package*.json ./
RUN npm install

# Copia o resto do código do frontend
COPY . .

# Roda o script de build (ex: para React, Vue, Angular)
RUN npm run build

# --- Estágio 2: Produção ---
# Use uma imagem leve do Nginx para servir os arquivos
FROM nginx:1.25-alpine

# Copia os arquivos estáticos gerados no estágio de build
# O caminho de origem pode ser /app/build, /app/dist, etc., dependendo do seu framework
COPY --from=builder /app/build /usr/share/nginx/html

# Copia o arquivo de configuração customizado do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 80 (padrão do Nginx)
EXPOSE 80

# O comando padrão do Nginx já inicia o servidor