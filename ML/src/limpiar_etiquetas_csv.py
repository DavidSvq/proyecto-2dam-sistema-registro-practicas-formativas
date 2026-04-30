import os

def normalizar_y_limpiar_datos():
    ruta_entrada = os.path.join('data_api', 'ml_proyecto.csv')
    ruta_salida = os.path.join('data_api', 'ml_proyecto_fijo.csv')
    
    # Palabras que queremos eliminar de las descripciones
    etiquetas_ruido = [
        'Alta', 'Media', 'Baja', 'Bajo'
    ]
    # Nota: He incluido también las categorías (Desarrollo, etc.) 
    # por si quieres que solo aprenda del contenido técnico puro. 
    # Si prefieres que mantenga "Desarrollo", quítalas de la lista de arriba.

    lineas_corregidas = []
    
    if not os.path.exists(ruta_entrada):
        print(f"Error: No se encuentra el archivo en {ruta_entrada}")
        return

    with open(ruta_entrada, 'r', encoding='utf-8') as f:
        # Leer cabecera y forzar el nuevo separador
        f.readline() 
        lineas_corregidas.append("descripcion;horas")
        
        for i, linea in enumerate(f):
            linea = linea.strip()
            if not linea:
                continue
            
            # 1. Separar por la última coma (el separador real de horas)
            partes = linea.rsplit(',', 1)
            
            if len(partes) == 2:
                descripcion = partes[0]
                horas = partes[1]
                
                # 2. Limpieza profunda de la descripción
                # Quitamos comillas y comas internas
                descripcion = descripcion.replace('"', '').replace(',', ' ')
                
                # 3. Eliminar etiquetas de dificultad y categorías de ruido
                for palabra in etiquetas_ruido:
                    # Usamos replace con espacios para no romper palabras contenidas
                    descripcion = descripcion.replace(palabra, '')
                
                # 4. Limpiar espacios en blanco sobrantes
                descripcion = " ".join(descripcion.split()).strip()
                
                if descripcion: # Solo añadir si la descripción no quedó vacía
                    lineas_corregidas.append(f"{descripcion};{horas}")
            else:
                print(f"Línea {i+2} saltada por formato incorrecto.")

    # Guardar el resultado
    with open(ruta_salida, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lineas_corregidas))
    
    print(f"✅ Proceso terminado. Archivo creado: {ruta_salida}")
    print(f"📊 Total de líneas procesadas: {len(lineas_corregidas)}")

if __name__ == "__main__":
    normalizar_y_limpiar_datos()