# backend/Dockerfile

# --- Estágio 1: Builder com Oracle Instant Client ---
# Usamos uma imagem base Debian (slim) que é mais compatível com as libs da Oracle
FROM node:18-slim AS builder

# Instala dependências necessárias para o Oracle Client
RUN apt-get update && apt-get install -y libaio1 unzip

# Variáveis de ambiente para o Oracle Client
ENV INSTANT_CLIENT_DIR=/opt/oracle/instantclient
ENV LD_LIBRARY_PATH=$INSTANT_CLIENT_DIR
ENV OCI_LIB_DIR=$INSTANT_CLIENT_DIR
ENV OCI_INC_DIR=$INSTANT_CLIENT_DIR/sdk/include

# Crie o diretório e copie os zips do Instant Client
# !!! IMPORTANTE: Coloque os zips baixados do site da Oracle na pasta 'backend' !!!
WORKDIR /opt/oracle
COPY instantclient-basiclite-linux.x64-*.zip .
COPY instantclient-sdk-linux.x64-*.zip .

# Descompacta os arquivos e remove os zips
RUN unzip "instantclient-basiclite-linux.x64-*.zip" && \
    unzip "instantclient-sdk-linux.x64-*.zip" && \
    # Renomeia a pasta para um nome genérico, independente da versão
    mv /opt/oracle/instantclient_* /opt/oracle/instantclient && \
    rm -f *.zip && \
    # Adiciona o caminho da lib ao sistema
    echo /opt/oracle/instantclient > /etc/ld.so.conf.d/oracle-instantclient.conf && \
    ldconfig

# --- Estágio 2: Imagem Final ---
FROM node:18-slim

# Copia as bibliotecas do Oracle Client do estágio anterior
COPY --from=builder /opt/oracle/instantclient /opt/oracle/instantclient
COPY --from=builder /etc/ld.so.conf.d/oracle-instantclient.conf /etc/ld.so.conf.d/oracle-instantclient.conf

# Define as mesmas variáveis de ambiente e atualiza o ldconfig
ENV LD_LIBRARY_PATH=/opt/oracle/instantclient
RUN ldconfig

WORKDIR /usr/src/app

# Copia package.json e package-lock.json
COPY package*.json ./

# Instala as dependências do projeto (incluindo node-oracledb)
RUN npm install

# Copia o resto do código da aplicação
COPY . .

# Expõe a porta que o backend vai usar
EXPOSE 5000

# Comando para iniciar a aplicação
CMD [ "npm", "start" ]