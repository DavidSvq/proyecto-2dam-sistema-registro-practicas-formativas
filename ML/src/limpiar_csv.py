import os

def limpiar_csv_puro():
    # Rutas basadas en tu estructura actual
    ruta_entrada = os.path.join('data_api', 'ml_proyecto.csv')
    ruta_salida = os.path.join('data_api', 'ml_proyecto_apto.csv')
    
    if not os.path.exists(ruta_entrada):
        print(f"❌ Error: No se encuentra {ruta_entrada}")
        return

    lineas_limpias = []

    try:
        with open(ruta_entrada, 'r', encoding='utf-8') as f:
            # Forzamos la cabecera con tus nombres reales
            f.readline() 
            lineas_limpias.append("descripcion;horas")
            
            for i, linea in enumerate(f):
                linea = linea.strip()
                if not linea:
                    continue
                
                # Separamos por la última coma (la que separa el texto de las horas)
                partes = linea.rsplit(',', 1)
                
                if len(partes) == 2:
                    texto = partes[0]
                    horas = partes[1]
                    
                    # LIMPIEZA DE ESTRUCTURA ÚNICAMENTE:
                    # Quitamos comillas y cambiamos comas internas por espacios
                    texto_limpio = texto.replace('"', '').replace("'", "").replace(',', ' ')
                    # Quitamos espacios extra que hayan quedado
                    texto_limpio = " ".join(texto_limpio.split()).strip()
                    
                    lineas_limpias.append(f"{texto_limpio};{horas}")
                else:
                    print(f"⚠️ Línea {i+2} ignorada por formato incorrecto.")

        # Guardar el archivo final
        with open(ruta_salida, 'w', encoding='utf-8') as f:
            f.write('\n'.join(lineas_limpias))
        
        print(f"✅ Archivo estructurado correctamente: {ruta_salida}")
        print(f"📊 Total líneas: {len(lineas_limpias)}")

    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    limpiar_csv_puro()