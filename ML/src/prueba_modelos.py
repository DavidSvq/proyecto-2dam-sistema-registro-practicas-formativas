import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score

# 1. Carga de datos
DATA_PATH = os.path.join('data_api', 'ml_proyecto_apto.csv')
try:
    df = pd.read_csv(DATA_PATH, sep=';', encoding='utf-8')
    print(f"✅ Archivo cargado: {DATA_PATH}")
except FileNotFoundError:
    print(f"❌ No se encuentra el archivo en: {DATA_PATH}")
    exit()

# 2. Preparación de los datos
X_text = df['descripcion']
y = df['horas']

# 3. Vectorización (TF-IDF)
vectorizer = TfidfVectorizer(max_features=1000)
X = vectorizer.fit_transform(X_text)

# 4. División Entrenamiento/Prueba
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 5. Definición de modelos a comparar
modelos = {
    "Regresión Lineal": LinearRegression(),
    "Árbol de Decisión": DecisionTreeRegressor(max_depth=10, random_state=42),
    "Random Forest": RandomForestRegressor(n_estimators=100, random_state=42)
}

# 6. Entrenamiento y Evaluación
resultados_metricas = []
nombres = []
valores_r2 = []
predicciones_finales = {}

print("\n" + "="*50)
print(" COMPARATIVA DE MODELOS DE PREDICCIÓN ")
print("="*50 + "\n")

for nombre, modelo in modelos.items():
    modelo.fit(X_train, y_train)
    y_pred = modelo.predict(X_test)
    
    r2 = r2_score(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)
    
    # Guardamos para la tabla y gráficos
    resultados_metricas.append({
        "Modelo": nombre,
        "R² (Precisión)": f"{r2:.4f}",
        "Error Medio (Horas)": f"{mae:.2f}h"
    })
    nombres.append(nombre)
    valores_r2.append(r2)
    predicciones_finales[nombre] = y_pred

# 7. Mostrar resultados en consola
df_resultados = pd.DataFrame(resultados_metricas)
print(df_resultados.to_string(index=False))

# --- GENERACIÓN DE GRÁFICOS ---

# Gráfico 1: Barras Comparativas de R²
plt.figure(figsize=(10, 6))
bars = plt.bar(nombres, valores_r2, color=['#e74c3c', '#f1c40f', '#2ecc71'])
plt.axhline(0, color='black', linewidth=0.8)
plt.title('Comparativa de Precisión (R²)', fontsize=14)
plt.ylabel('Valor R²')
plt.ylim(min(valores_r2) - 0.1, 1.0) # Ajuste dinámico de escala

# Añadir etiquetas de valor sobre las barras
for bar in bars:
    yval = bar.get_height()
    plt.text(bar.get_x() + bar.get_width()/2, yval + 0.02, f'{yval:.4f}', ha='center', va='bottom', fontweight='bold')

plt.savefig(os.path.join('data_api', 'comparativa_modelos.png'))
print("\n📊 Gráfico de barras guardado en: data_api/comparativa_modelos.png")

# Gráfico 2: Dispersión Predicción vs Realidad (Random Forest)
plt.figure(figsize=(8, 8))
y_pred_rf = predicciones_finales["Random Forest"]
plt.scatter(y_test, y_pred_rf, alpha=0.5, color='#2ecc71', label='Predicciones RF')
# Línea ideal de 45 grados
lims = [0, max(max(y_test), max(y_pred_rf))]
plt.plot(lims, lims, 'r--', alpha=0.75, zorder=0, label='Ideal')

plt.title('Predicción vs Realidad (Mejor Modelo: Random Forest)', fontsize=14)
plt.xlabel('Horas Reales')
plt.ylabel('Horas Predichas')
plt.legend()
plt.grid(True, linestyle='--', alpha=0.6)

plt.savefig(os.path.join('data_api', 'dispersion_random_forest.png'))
print("📈 Gráfico de dispersión guardado en: data_api/dispersion_random_forest.png")

print("\n" + "="*50)
print("CONCLUSIÓN:")
mejor_modelo = df_resultados.sort_values(by="R² (Precisión)", ascending=False).iloc[0]
print(f"El mejor modelo es '{mejor_modelo['Modelo']}' con un R² de {mejor_modelo['R² (Precisión)']}")
print("="*50)