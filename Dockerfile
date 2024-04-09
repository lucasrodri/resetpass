# Estágio de base com todas as dependências do sistema necessárias
FROM node:20.12 as baseImage

# Definindo o diretório de trabalho no container
WORKDIR /usr/src/app

# Adicionando argumento NODE_ENV com padrão 'production'
ARG NODE_ENV=production

# Copiando arquivos package.json e package-lock.json
COPY ./app/package*.json ./

# Instalar as dependências do projeto Node.js
# Instala 'nodemon' apenas para ambientes de desenvolvimento
RUN if [ "$NODE_ENV" = "development" ]; then npm install && npm install nodemon; else npm install --only=production; fi

# Copiando o restante dos arquivos para o diretório de trabalho
COPY ./app .

EXPOSE 5000

# Comando para rodar o aplicativo. Usar 'node' para produção e 'nodemon' para desenvolvimento
CMD if [ "$NODE_ENV" = "development" ]; then npx nodemon app.js; else node app.js; fi