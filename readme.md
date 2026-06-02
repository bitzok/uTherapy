# UTherapy

UTherapy es una aplicación móvil (desarrollada con enfoque responsive/PWA) diseñada para actuar como un primer filtro de apoyo y prevención frente a la depresión y crisis emocionales en estudiantes universitarios. 

La idea nace al ver cómo la carga académica y el estrés del entorno universitario aíslan a muchos estudiantes. Este chatbot no busca reemplazar a un psicólogo, sino romper el estigma, ofrecer escucha activa 24/7 y servir de puente entre el estudiante y el área de bienestar de su universidad.

---

## El Enfoque Técnico: ¿Cómo funciona la IA aquí?

Para evitar las respuestas genéricas o las peligrosas "alucinaciones" que suelen tener los modelos de lenguaje en temas tan delicados como la salud mental, el proyecto no usa un prompt simple. Está estructurado bajo una arquitectura de **RAG (Retrieval-Augmented Generation)** y un proceso de **Fine-Tuning**.

1. **Modelo Base:** Se utiliza **DeepSeek** por su alta capacidad de razonamiento técnico y optimización de costos/latencia.
2. **Base de Conocimiento (RAG):** El backend procesa, vectoriza e indexa documentos especializados, guías clínicas de prevención del suicidio/depresión estudiantil y protocolos universitarios. Cuando el usuario habla, el sistema busca contextualmente la información aprobada y se la inyecta al modelo antes de responder.
3. **Fine-Tuning de Comportamiento:** El modelo está calibrado específicamente para mantener un tono de primeros auxilios psicológicos (validación emocional, escucha empática) y tiene un límite estricto: no diagnostica médicamente y sabe cuándo sugerir ayuda profesional inmediata.

---

## Stack Tecnológico

Elegí este stack buscando separar por completo la lógica de negocio y procesamiento de IA del consumo en la interfaz:

* **Backend:** 
  * **Python & FastAPI:** Elegido principalmente por el soporte nativo de librerías de IA y el manejo asíncrono (`async/await`), crucial para procesar el streaming de texto del chatbot sin bloquear el servidor.
  * **Base de Datos Vectorial:** Para almacenar los embeddings de los documentos del RAG y realizar búsquedas de similitud semántica en milisegundos.
* **Frontend:**
  * **Angular:** Utilizado para estructurar una SPA/PWA sólida. Me permitió manejar el estado de la conversación de forma limpia, modular los componentes del chat y asegurar una interfaz fluida y adaptada a dispositivos móviles.

---

## Arquitectura y Buenas Prácticas

* **Pipeline Asíncrono:** La comunicación con la API de DeepSeek y la consulta a la base vectorial corren de forma totalmente asíncrona en FastAPI para soportar concurrencia.
* **Inyección Limpia de Contexto:** El flujo de RAG limpia el texto de los documentos cargados, evita duplicados y optimiza los tokens enviados en la ventana de contexto.
* **Modularidad en Angular:** Separación estricta entre los servicios que manejan los WebSockets/HTTP del chat y los componentes de la interfaz.
* **Diseño UI/UX Consciente:** La interfaz usa una paleta de colores pensada para no generar estrés visual, con transiciones suaves que hacen que la interacción con el bot se sienta natural.
