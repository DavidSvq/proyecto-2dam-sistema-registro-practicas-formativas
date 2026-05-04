# 🤖 Microservicio de Predicción - FastAPI

Bienvenido al microservicio de predicción del sistema. Este componente se encarga de estimar la duración de las tareas mediante modelos de análisis predictivo.

---

### 📝 Descripción del Servicio

El **Microservicio de Predicción** es un componente desacoplado desarrollado con **FastAPI**, cuya función principal es proporcionar estimaciones de tiempo para las tareas registradas en el sistema.

Este servicio forma parte de la arquitectura de microservicios y actúa como un sistema de apoyo a la toma de decisiones, permitiendo mejorar la planificación y seguimiento de las prácticas formativas.

---

### ⚙️ Funcionamiento

El flujo de operación del microservicio es el siguiente:

1. El **backend (Spring Boot)** invoca el servicio durante la creación de una tarea.
2. Se envían los datos relevantes de la tarea al microservicio.
3. El sistema procesa la información mediante un modelo de predicción.
4. Se devuelve una estimación de horas al backend.

---

### 🔌 Características Principales

* **Integración con Backend:** Comunicación directa mediante API REST.
* **Procesamiento en Tiempo Real:** Respuesta inmediata ante cada solicitud.
* **Servicio Stateless:** No almacena información persistente.
* **Arquitectura Desacoplada:** Permite escalabilidad y mantenimiento independiente.

---

### 🧠 Modelo de Predicción

El microservicio utiliza un modelo de predicción para estimar la duración de las tareas en función de los datos recibidos. Este modelo puede evolucionar y mejorar sin afectar al resto del sistema gracias al desacoplamiento del servicio.

---

### 🚀 Ejecución

El microservicio se despliega automáticamente como parte del entorno global mediante **Docker Compose**, quedando accesible a través del puerto:

* **8000** → Servicio FastAPI

---

### 📡 Endpoints

* **POST /predict**
  * Recibe los datos de una tarea
  * Devuelve una estimación de duración en horas

---

### 📂 Integración en el Sistema

Este microservicio no actúa como fuente de datos, sino como un servicio auxiliar de cálculo, siendo invocado exclusivamente por el backend en los momentos necesarios.

---

👉 **[Volver al Repositorio Principal](../README.md)**