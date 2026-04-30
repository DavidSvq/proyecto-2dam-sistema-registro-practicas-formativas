import pandas as pd
import pickle
import os
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score

# 1. Configuración de rutas
DATA_PATH = os.path.join('data_api', 'ml_proyecto_fijo.csv')
MODEL_DEST = os.path.join('models', 'modelo_v2.pkl')
VECTORIZER_DEST = os.path.join('models', 'vectorizador_v2.pkl')

def train():
    # Asegurar que la carpeta models existe
    os.makedirs('models', exist_ok=True)

    # 2. Carga de datos
    print("Cargando datos...")
    df = pd.read_csv(DATA_PATH, sep=';', encoding='utf-8')
    
    # 3. Preparación de variables
    # X: Descripciones, y: Horas a predecir
    X = df['descripcion']
    y = df['horas']

    # 4. División Entrenamiento / Prueba (80% / 20%)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # 5. Vectorización (TF-IDF)
    print("Vectorizando texto...")
    vectorizer = TfidfVectorizer(max_features=1000)
    X_train_tfidf = vectorizer.fit_transform(X_train)
    X_test_tfidf = vectorizer.transform(X_test)

    # 6. Entrenamiento del Modelo (Random Forest)
    print("Entrenando el modelo...")
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train_tfidf, y_train)

    # 7. Evaluación (¡Esto es para tu memoria del proyecto!)
    predictions = model.predict(X_test_tfidf)
    mae = mean_absolute_error(y_test, predictions)
    r2 = r2_score(y_test, predictions)

    print("\n--- RESULTADOS DE VALIDACIÓN ---")
    print(f"Error Medio Absoluto (MAE): {mae:.2f} horas")
    print(f"Coeficiente de determinación (R2): {r2:.2f}")
    print("--------------------------------\n")

    # 8. Guardado de archivos
    print("Guardando archivos .pkl...")
    with open(MODEL_DEST, 'wb') as f:
        pickle.dump(model, f)
    
    with open(VECTORIZER_DEST, 'wb') as f:
        pickle.dump(vectorizer, f)

    print("¡Proceso completado con éxito!")

if __name__ == "__main__":
    train()