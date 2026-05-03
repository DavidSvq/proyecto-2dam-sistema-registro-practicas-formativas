# Usamos la imagen de Node que ya conoces
FROM node:20-slim

# Directorio de trabajo
WORKDIR /app

# Copiamos solo los archivos de dependencias para aprovechar la caché de Docker
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del código del proyecto
COPY . .

# Exponemos el puerto de Vite
EXPOSE 5173

# Comando para arrancar Vite
# Usamos --host para que Docker permita el tráfico externo
# Usamos --port para asegurar que siempre use el 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]