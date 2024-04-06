# Estágio de base com todas as dependências do sistema necessárias
FROM node:20.12 as baseImage

# Definindo o diretório de trabalho no container
WORKDIR /usr/src/app

# Agora, como pptruser, copie os arquivos package*.json no diretório de trabalho.
COPY ./app/package*.json ./

# Instalar as dependências do projeto Node.js especificadas no 'package.json'
RUN npm install

# Copie o restante dos arquivos para o diretório de trabalho, garantindo a propriedade correta.
COPY ./app .

EXPOSE 5000

# Comando para rodar o aplicativo usando npm start conforme especificado no seu package.json
CMD [ "npm", "start" ]