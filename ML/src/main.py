from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pickle
import os

# El esquema ahora es ultra sencillo: solo llega el texto final
class PrediccionSimpleRequest(BaseModel):
    descripcion_completa: str

app = FastAPI(title="Motor de Estimación de Horas - DAM")

# Carga de archivos (asegúrate de tener los .pkl en la carpeta models)
MODEL_PATH = os.path.join('models', 'modelo_v1_etiquetas.pkl')
VECTORIZER_PATH = os.path.join('models', 'vectorizador_v1.pkl')

try:
    with open(MODEL_PATH, 'rb') as f:
        model = pickle.load(f)
    with open(VECTORIZER_PATH, 'rb') as f:
        vectorizer = pickle.load(f)
    print("✅ Modelos cargados y listos")
except Exception as e:
    print(f"❌ Error al cargar modelos: {e}")

@app.post("/predict")
async def predict(request: PrediccionSimpleRequest):
    # Verificamos que no llegue vacío
    if not request.descripcion_completa.strip():
        raise HTTPException(status_code=400, detail="La descripción no puede estar vacía")
    
    try:
        # 1. Transformar el texto (TF-IDF)
        X = vectorizer.transform([request.descripcion_completa])
        
        # 2. Predecir
        prediccion = model.predict(X)
        
        # 3. Formatear resultado
        horas_brutas = float(prediccion[0]) 
        horas = round(horas_brutas * 4) / 4  # Redondear a cuartos de hora
        
        return {
            "horas_estimadas": horas
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en la predicción: {str(e)}")
    

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")