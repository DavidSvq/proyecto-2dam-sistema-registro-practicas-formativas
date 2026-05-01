FROM python:3.11-slim

WORKDIR /app

# Copiamos requerimientos
COPY requirements.txt .

# Instalamos librerías
RUN pip install --no-cache-dir -r requirements.txt

# Copiamos todo el contenido de la carpeta ML al contenedor
COPY . .

# Exponemos el puerto que me has confirmado
EXPOSE 8000

# Ejecutamos main.py que está dentro de src/
CMD ["python", "src/main.py"]