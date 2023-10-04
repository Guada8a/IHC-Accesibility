import cv2
import numpy as np
import pygame
import sys

# Inicializar Pygame
pygame.init()

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

# Inicializar la pantalla
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption("Pelota en la cuadrícula")

# Posición inicial de la pelota en la cuadrícula (centro)
ball_x, ball_y = GRID_SIZE // 2, GRID_SIZE // 2

# Velocidad de movimiento de la pelota
BALL_SPEED = 1

# Función para dibujar la cuadrícula y la pelota
def draw_grid_and_ball():
    screen.fill(WHITE)

    for x in range(GRID_SIZE):
        for y in range(GRID_SIZE):
            pygame.draw.rect(screen, BLACK, (x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE), 1)

    pygame.draw.circle(screen, RED, (ball_x * CELL_SIZE + CELL_SIZE // 2, ball_y * CELL_SIZE + CELL_SIZE // 2), BALL_RADIUS)

# Inicializar la cámara web
cap = cv2.VideoCapture(0)

# Inicializar el clasificador de rostros de OpenCV
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# Inicializar la posición de la pelota en la cuadrícula (centro)
ball_x, ball_y = GRID_SIZE // 2, GRID_SIZE // 2

# Inicializar la dirección de movimiento de la pelota
ball_direction = None  # None significa que la pelota está quieta

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # Voltear el fotograma horizontalmente para que sea como un espejo
    frame = cv2.flip(frame, 1)

    # Obtener el tamaño del fotograma
    frame_height, frame_width, _ = frame.shape

    # Convertir el fotograma a escala de grises para la detección de rostros
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # Detectar rostros en el fotograma
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5, minSize=(30, 30))

    # Dibujar la cuadrícula y la pelota en Pygame
    draw_grid_and_ball()

    if len(faces) > 0:
        # Tomar la posición del primer rostro detectado
        (x, y, w, h) = faces[0]

        # Calcular la posición del centro del rostro
        face_center_x = x + w // 2
        face_center_y = y + h // 2

        # Determinar la dirección del gesto de cabeza
        if face_center_y < frame_height // 3:  # Si el centro del rostro está en la parte superior
            ball_direction = "up"
        elif face_center_y > 2 * frame_height // 3:  # Si el centro del rostro está en la parte inferior
            ball_direction = "down"
        elif face_center_x < frame_width // 3:  # Si el centro del rostro está en la parte izquierda
            ball_direction = "left"
        elif face_center_x > 2 * frame_width // 3:  # Si el centro del rostro está en la parte derecha
            ball_direction = "right"
        else:
            ball_direction = None

    # Actualizar la posición de la pelota en función de la dirección del gesto
    if ball_direction == "up":
        ball_y = max(0, ball_y - 1)
    elif ball_direction == "down":
        ball_y = min(GRID_SIZE - 1, ball_y + 1)
    elif ball_direction == "left":
        ball_x = max(0, ball_x - 1)
    elif ball_direction == "right":
        ball_x = min(GRID_SIZE - 1, ball_x + 1)

    # Mostrar la pantalla de Pygame
    pygame.display.flip()

    # Mostrar el fotograma de la cámara con la detección de rostro
    cv2.imshow("Face Detection", frame)

    # Salir del bucle si se presiona la tecla 'q'
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break
    
# Liberar la cámara y cerrar las ventanas de OpenCV y Pygame
cap.release()
cv2.destroyAllWindows()
pygame.quit()