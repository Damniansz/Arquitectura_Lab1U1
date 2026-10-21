# WeatherML

Aplicación web de predicción de lluvia desarrollada con Python y Flask mediante la arquitectura **Tuberías y Filtros**.

## Requisitos

- Python 3.10 o superior.

## Instalación y ejecución

```bat
git clone https://github.com/Damniansz/Arquitectura_Lab1U1.git
cd Arquitectura_Lab1U1
python -m venv venv
venv\Scripts\activate
python -m pip install -r requirements.txt
python app.py
```

Abrir http://127.0.0.1:5001.

## Uso

1. Cargar un CSV con las columnas `temperature`, `humidity`, `pressure`, `wind_speed` y `rain`.
2. Entrenar el modelo y revisar las métricas y la matriz de confusión.
3. Ingresar una observación en el formulario para predecir lluvia.

La columna `rain` debe contener ambas clases: `Yes` y `No`. Utilizar las mismas unidades del dataset al ingresar datos.

## Arquitectura

Cinco filtros independientes realizan la carga, validación, preparación, entrenamiento y evaluación. Se utiliza Random Forest con una división de datos de 80 % para entrenamiento y 20 % para prueba.

El modelo se genera en `models/weather_model.joblib`.

## Mejoras

- Formulario de predicción en una plantilla independiente.
- Recuperación del modelo guardado.
- Modal de procesamiento y presentación visual de resultados.

Las predicciones son estimaciones y pueden ser incorrectas.