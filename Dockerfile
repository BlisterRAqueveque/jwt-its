# Stage 1: Build de la aplicación | build es el flag del stage
FROM node:18 AS builder

# Establece el directorio de trabajo
WORKDIR /

# Copia los archivos de dependencias y los instala
COPY package*.json ./
RUN npm i -g @nestjs/cli
RUN npm install

# Copia el resto de los archivos del proyecto
COPY . .

# Construye la aplicación en modo producción
RUN nest build

# Stage 2: Imagen final
FROM node:18-alpine

# Copia los archivos de build desde el contenedor builder
COPY --from=builder /dist ./dist
COPY --from=builder /node_modules ./node_modules
COPY --from=builder /package*.json ./

# Crea el directorio de uploads en el root
RUN mkdir -p /uploads
# Asegura permisos de escritura para la carpeta de uploads
RUN chmod -R 777 /uploads

# Exponer el puerto 3000
EXPOSE 3000

CMD ["node", "dist/main.js"]

# EJECUTAR AMBIENTE PROD
    # docker build -t shell-app .
    # docker build --no-cache -t shell-app .
    # docker run -p 80:80 shell-app
    # docker run -it shell-app /bin/sh