const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gridSize = 3;
const cellWidth = canvas.width / gridSize;
const cellHeight = canvas.height / gridSize;
const objectSpeed = cellWidth;
let objectX = 0;
let objectY = 0;
let history = [];

const recognition = new webkitSpeechRecognition();
let isRecognizing = false;

recognition.lang = "es-ES"; // Cambia el idioma según tus necesidades

recognition.onstart = function () {
    isRecognizing = true;
};

recognition.onend = function () {
    isRecognizing = false;
    recognition.start(); // Reiniciar el reconocimiento automáticamente
};

recognition.onresult = function (event) {
    const command = event.results[0][0].transcript.toLowerCase();
    document.getElementById("comandos").textContent = command;
    let dec = handleVoiceCommand(command);
    if (dec)
        saveHistory(command);
};

recognition.start(); // Iniciar el reconocimiento automáticamente al cargar la página

// Función que guarda el historial de comandos
function saveHistory(command) {
    // Guardar el comando en el array
    history.push(command);

    // Crear un elemento de historial y configurar su contenido y clase
    const historyItem = document.createElement("a");
    historyItem.classList.add("list-group-item", "list-group-item-action");
    // historyItem.textContent = "Último comando: " + command;

    // Insertar el elemento de historial al inicio de la lista
    const historyList = document.getElementById("history");
    historyList.insertBefore(historyItem, historyList.firstChild);

    // Si es el último comando, pon la clase active (opcional)
    const items = historyList.querySelectorAll(".list-group-item");
    items.forEach(item => {
        item.classList.remove("active");
        //Quitar "Ultimo comando:"
        item.textContent = item.textContent.replace("Último comando: ", "");
    });
    historyItem.textContent = "Último comando: " + command;
    historyItem.classList.add("active");
    
}

// Función para manejar los comandos de voz
function handleVoiceCommand(command) {
    //Array de comandos
    const commandsArriba = ["arriba", "sube", "subir"];
    const commandsAbajo = ["abajo", "baja", "bajar"];
    const commandsIzquierda = ["izquierda", "izquierdo", "izquierda"];
    const commandsDerecha = ["derecha", "derecho", "derecha"];
    const spanCommands = document.getElementById("comandos");

    //Comandos de voz
    if (commandsArriba.includes(command)) {
        objectY -= objectSpeed;
    } else if (commandsAbajo.includes(command)) {
        objectY += objectSpeed;
    } else if (commandsIzquierda.includes(command)) {
        objectX -= objectSpeed;
    } else if (commandsDerecha.includes(command)) {
        objectX += objectSpeed;
    } else {
        spanCommands.textContent = "commando no reconocido";
    }

    // Limitar las coordenadas dentro de los límites del canvas
    objectX = Math.max(0, Math.min(canvas.width - cellWidth, objectX));
    objectY = Math.max(0, Math.min(canvas.height - cellHeight, objectY))

    if (spanCommands.textContent != "commando no reconocido") {
        spanCommands.classList.remove("bg-danger");
        spanCommands.classList.add("bg-success");
        return true;
    } else {
        spanCommands.classList.remove("bg-success");
        spanCommands.classList.add("bg-danger");
        return false;
    }
}

//Comenzar con tensorFlow
//Cargar modelo
async function loadModel() {
    model = await tf.loadLayersModel("modelo/model.json");
    return model;
}

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    for (let x = cellWidth; x < canvas.width; x += cellWidth) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    for (let y = cellHeight; y < canvas.height; y += cellHeight) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

// function drawObject() {
//     ctx.fillStyle = "blue";
//     ctx.fillRect(objectX, objectY, cellWidth, cellHeight);
// }

function drawObject() {
    ctx.fillStyle = "#0B3C49";
    ctx.beginPath();
    const radius = Math.min(cellWidth, cellHeight) / 2; // Radio del círculo
    const centerX = objectX + cellWidth / 2; // Coordenada x del centro del círculo
    const centerY = objectY + cellHeight / 2; // Coordenada y del centro del círculo
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
}

function gameLoop() {
    drawGrid();
    drawObject();
    requestAnimationFrame(gameLoop);
}

gameLoop();
