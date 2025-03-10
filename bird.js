const gameContainer = document.getElementById('gameContainer');
const birdElem = document.getElementById('bird');
const scoreDisplay = document.getElementById('scoreDisplay');
const startScreen = document.getElementById('start-screen');
const lengthDisplay = document.getElementById('lengthDisplay');

// Ajout de l'image pour l'oiseau
birdElem.style.backgroundImage = "url('img/bird1.png')"; 
birdElem.style.backgroundSize = "contain"; 
birdElem.style.backgroundRepeat = "no-repeat";

let gameRunning = false;
let gameOver = false;
let score = 0;
let distance = 0;
let gravity = 0.4;
let jumpStrength = -8;
let pipeSpeed = 2.5;
let pipeGap = 130;
let spawnInterval = 90;
let birdY = 250;
let birdVelocity = 0;
let pipes = [];
let spawnCounter = 0;

// Écoute le clavier
document.addEventListener('keydown', (e) => {
    if (e.code === "Space") {
        e.preventDefault();
        birdVelocity = jumpStrength;
        if (!gameRunning) startGame();
    }
});

// Démarrer le jeu
function startGame() {
    gameRunning = true;
    gameOver = false;
    score = 0;
    distance = 0;
    birdY = 250;
    birdVelocity = 0;
    pipes = [];

    // Supprime les anciens tuyaux
    document.querySelectorAll('.pipe').forEach(pipe => pipe.remove());

    startScreen.style.display = "none";
    requestAnimationFrame(updateGame);
}

// Boucle de jeu principale
function updateGame() {
    if (!gameRunning) return;

    birdVelocity += gravity;
    birdY += birdVelocity;
    birdElem.style.top = birdY + "px";

    spawnCounter++;
    if (spawnCounter >= spawnInterval) {
        spawnPipe();
        spawnCounter = 0;
    }

    // Mise à jour des tuyaux
    for (let i = 0; i < pipes.length; i++) {
        pipes[i].x -= pipeSpeed;
        pipes[i].topElem.style.left = pipes[i].x + "px";
        pipes[i].bottomElem.style.left = pipes[i].x + "px";

        // Suppression des tuyaux hors écran
        if (pipes[i].x + pipes[i].width < 0) {
            pipes[i].topElem.remove();
            pipes[i].bottomElem.remove();
            pipes.splice(i, 1);
            i--;
            continue;
        }

        // Détection de collision
        if (collision(birdElem, pipes[i].topElem) || collision(birdElem, pipes[i].bottomElem)) {
            console.log("Collision détectée !");
            endGame();
        }

        // Score : si l’oiseau passe un tuyau, on augmente le score
        if (!pipes[i].passed && pipes[i].x + pipes[i].width < 50) {
            pipes[i].passed = true;
            score++;
            scoreDisplay.textContent = `SCORE: ${score}`;
        }
    }

    // Vérification des limites (toucher le sol)
    if (birdY + 40 >= gameContainer.clientHeight) {
        endGame();
    }

    // Mise à jour de la distance
    distance += 0.1;
    lengthDisplay.textContent = `LENGTH: ${Math.floor(distance)}m ❤️❤️❤️`;

    requestAnimationFrame(updateGame);
}

// Fin du jeu
function endGame() {
    gameRunning = false;
    gameOver = true;
    startScreen.style.display = "block";
}

// Génération des tuyaux
function spawnPipe() {
    const pipeWidth = 80; // Largeur fixe des tuyaux
    const gapHeight = 200; // Ajuste l’ouverture entre les tuyaux (augmenté pour meilleure jouabilité)
    const minPipeHeight = 100; // Empêche les tuyaux d’être trop petits
    const maxPipeHeight = gameContainer.clientHeight - gapHeight - minPipeHeight;

    // Génère la hauteur du tuyau supérieur aléatoirement
    const topHeight = Math.floor(Math.random() * (maxPipeHeight - minPipeHeight + 1)) + minPipeHeight;
    const bottomHeight = gameContainer.clientHeight - gapHeight - topHeight;
    const pipeX = gameContainer.clientWidth;

    // Création du tuyau du haut
    const topPipe = document.createElement('div');
    topPipe.classList.add('pipe', 'top');
    topPipe.style.height = `${topHeight}px`;
    topPipe.style.width = `${pipeWidth}px`;
    topPipe.style.left = `${pipeX}px`;

    // Création du tuyau du bas
    const bottomPipe = document.createElement('div');
    bottomPipe.classList.add('pipe', 'bottom');
    bottomPipe.style.height = `${bottomHeight}px`;
    bottomPipe.style.width = `${pipeWidth}px`;
    bottomPipe.style.left = `${pipeX}px`;

    // Ajoute les tuyaux au DOM
    gameContainer.appendChild(topPipe);
    gameContainer.appendChild(bottomPipe);

    // Enregistre les tuyaux pour mise à jour
    pipes.push({
        x: pipeX,
        width: pipeWidth,
        topHeight: topHeight,
        bottomHeight: bottomHeight,
        topElem: topPipe,
        bottomElem: bottomPipe,
        passed: false
    });
}


// Détection des collisions
function collision(bird, pipe) {
    const birdRect = bird.getBoundingClientRect();
    const pipeRect = pipe.getBoundingClientRect();

    return !(
        birdRect.top > pipeRect.bottom ||
        birdRect.bottom < pipeRect.top ||
        birdRect.left > pipeRect.right ||
        birdRect.right < pipeRect.left
    );
}

// Gestion des boutons Pause, Restart et Paramètres
document.getElementById("pause-btn").addEventListener("click", () => {
    gameRunning = !gameRunning;
    if (gameRunning) requestAnimationFrame(updateGame);
});

document.getElementById("restart-btn").addEventListener("click", () => {
    startGame();
});

document.getElementById("settings-btn").addEventListener("click", () => {
    alert("Paramètres non implémentés !");
});
