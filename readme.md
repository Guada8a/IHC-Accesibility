# Práctica IHC: ```Paradigmas de Interacción```

## Reconocimiento de voz || Speech Recognition
![image](https://github.com/Guada8a/IHC-Accesibility/assets/75002967/ce2c17ab-db43-41a1-b5f9-e6559e7dce20)

- El código funciona con el webkit Speech Recognition
  ![image](https://github.com/Guada8a/IHC-Accesibility/assets/75002967/8eeddde9-fb20-4d75-8b42-e539b9dd5885)

- Acepta los siguientes comandos para moverse
  ![image](https://github.com/Guada8a/IHC-Accesibility/assets/75002967/adfe2574-e050-4291-af6a-7d6bae346893)

- Mostrará el comando ingresado en este apartado:
  - ![image](https://github.com/Guada8a/IHC-Accesibility/assets/75002967/d95e265d-3b0c-429c-bb62-40d692ca2bf7)
  - En caso de ser érroneo mostrará:
     - ![image](https://github.com/Guada8a/IHC-Accesibility/assets/75002967/460ef4db-0198-44e3-923d-82424b9552ed)

- Los comandos se irán guardando en formato de lista dejando en primer lugar al último comando dicho por el usuario:
  -  ![image](https://github.com/Guada8a/IHC-Accesibility/assets/75002967/b53967b4-700e-4c87-b382-f8a91058f3c5)

## Reconocimiento gestual || python
<p>
  Usa la misma interfaz de arriba pero ahora con el uso del lenguaje python
</p>

### Librerías
```python
import cv2
import numpy as np
import pygame
import sys
```
### Variables de entorno
```python
# Configuración de la pantalla
SCREEN_WIDTH = 300
SCREEN_HEIGHT = 300
GRID_SIZE = 3
CELL_SIZE = SCREEN_WIDTH // GRID_SIZE
BALL_RADIUS = CELL_SIZE // 2

# Colores
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED = (255, 0, 0)
```
### Función que dibuja la cuadrícula y el círculo
```python
def draw_grid_and_ball():
    screen.fill(WHITE)

    for x in range(GRID_SIZE):
        for y in range(GRID_SIZE):
            pygame.draw.rect(screen, BLACK, (x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE), 1)

    pygame.draw.circle(screen, RED, (ball_x * CELL_SIZE + CELL_SIZE // 2, ball_y * CELL_SIZE + CELL_SIZE // 2), BALL_RADIUS)
```
### Clasificador de Rostros de OpenCV
```python
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
```
### Ciclo de ejecución
```python
while True:
    ret, frame = cap.read()
    if not ret:
        break

    # Voltear el fotograma horizontalmente para que sea como un espejo
    frame = cv2.flip(frame, 1)

    # Obtener el tamaño del fotograma
    frame_height, frame_width, _ = frame.shape

    # Dibujar la cuadrícula y la pelota en Pygame
    draw_grid_and_ball()

    # Mostrar la pantalla de Pygame
    pygame.display.flip()

    # Convertir el fotograma a escala de grises para la detección de rostros
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # Detectar rostros en el fotograma
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5, minSize=(30, 30))

    if len(faces) > 0:
        # Tomar la posición del primer rostro detectado
        (x, y, w, h) = faces[0]

        # Calcular la posición del centro del rostro
        face_center_x = x + w // 2
        face_center_y = y + h // 2

        # Actualizar la posición de la pelota en función del centro del rostro
        ball_x = int((face_center_x / frame_width) * GRID_SIZE)
        ball_y = int((face_center_y / frame_height) * GRID_SIZE)

    # Mostrar el fotograma de la cámara con la detección de rostro
    cv2.imshow("Face Detection", frame)

    # Salir del bucle si se presiona la tecla 'q'
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

```
