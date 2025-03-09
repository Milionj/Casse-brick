// J'ai créé un "canvas" Phaser de 1000x700 pixels.
// J'ai activé la physique arcade pour gérer les collisions.
// La balle ne rebondit plus en bas, elle sort et déclenche "Game Over" si toutes les vies sont perdues.
// La raquette est contrôlable avec les touches de gauche et droite.
// Ajout des niveaux et gestion de la difficulté.
// La balle peut être relancée après une perte de vie.
// Ajout d'un bouton permettant de relancer la balle après une perte.

//problemes rencontrés:

// 1. La balle ne rebondit pas en bas, elle sort et déclenche Game Over si toutes les vies sont perdues:
// Cause principale : La balle avait une propriété setCollideWorldBounds(true) qui la faisait rebondir sur toutes les limites de l’écran, y compris le bas.
// -Tenter de capter la sortie avec this.physics.world.on('worldbounds', (body, up, down) => {...})
// -Mais
// problème : down ne détectait pas toujours bien la sortie de la balle.
// Explication : La méthode onWorldBounds ne fonctionne que si checkWorldBounds et onWorldBounds sont activés sur la balle.
// solucce : ball.setCollideWorldBounds(true, undefined, undefined, false); Le false à la fin désactive le rebond uniquement en bas
// 2. La raquette ne peut pas être déplacée sur les bords du canvas.

let cursors; // Variable pour stocker les touches du clavier
let bricks; // Groupe de briques
let ball; // La balle du jeu
let paddle; // La raquette
let level = 1; // Niveau actuel
let lives = 3; // Nombre de vies
let levelText; // Texte affichant le niveau
let livesText; // Texte affichant les vies restantes
let ballLaunched = false; // Vérifie si la balle a été lancée ou non
let diamondCount = 0;  // Nombre de diamants
let diamondText;   // Texte affichant les diamants

// Récupération des éléments HTML (level, vies, diamant)
const levelDisplay = document.getElementById("level-display");
const livesDisplay = document.getElementById("lives-display");
const diamondsDisplay = document.getElementById("diamonds-display");


const config = {
    type: Phaser.AUTO,
    width: 1000, // Ajusté pour correspondre au CSS
    height: 700, // Ajusté pour correspondre au CSS
    backgroundColor: "#5C2E1F",
    parent: "game-container", // Associe Phaser au bon conteneur
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },

    scene: {
        preload: preload, // Chargement des assets
        create: create, // Création des objets du jeu
        update: update // Mise à jour du jeu
    }
};

// Création du jeu Phaser
const game = new Phaser.Game(config);

// Chargement des images du jeu
function preload() {
    this.load.image("paddle", "img/raquetteFigama.png"); // La raquette
    this.load.image("ball", "img/balleFigma.png"); // La balle
    this.load.image("maron", "img/rectangleMaron.png");
    this.load.image("vert", "img/rectangleVert.png"); 
    this.load.image("noir", "img/rectangleNoir.png");
    this.load.image("roseViolet", "img/rectangleRoseViolet.png");
    this.load.image("violet", "img/rectangleViolet.png");
    this.load.image('settings', 'img/parametres.png'); // Icône paramètres
    this.load.image('gifts', 'img/encore.png'); // Icône cadeaux
    this.load.image('pause', 'img/jouer.png'); // Icône pause
    this.load.image('diamonds', 'img/teteDiams.png'); // Icône diamant
}

// Création des objets du jeu
function create() {
    // Création de la raquette
    paddle = this.physics.add.sprite(config.width / 2, 650, "paddle");
    paddle.setImmovable(true); // La raquette ne bouge pas sous l'effet de la balle
    paddle.setScale(0.4); // Réduit la taille de la raquette
    paddle.setCollideWorldBounds(true); // Empêche la raquette de sortir du cadre


    // Création de la balle
    ball = this.physics.add.sprite(config.width / 2, 500, "ball");
    ball.setBounce(1); // La balle rebondit parfaitement
    ball.setScale(0.6); // Réduction de la taille de la balle
    ball.setVelocity(0, 0); // La balle ne bouge pas au départ

    // 🚨 Désactivation de la collision avec le bas 🚨
    ball.setCollideWorldBounds(true); // Active la collision avec les bords
    ball.body.onWorldBounds = true; // Détecte quand la balle sort du monde

    // Détecter la sortie de la balle pour déclencher la perte de vie
    // Ajout d'un événement pour détecter quand la balle sort par le bas
    this.physics.world.on('worldbounds', (body, up, down) => {
        if (body.gameObject === ball && down) { // Si la balle sort par le bas
            perdreVie(this); // Gère la perte de vie
        }
    });
    

    // Ajout des touches du clavier
    cursors = this.input.keyboard.createCursorKeys();

    // Création des briques
    createBricks.call(this);
    // Gestion des collisions
    this.physics.add.collider(ball, paddle, ballHitPaddle, null, this);
    this.physics.add.collider(ball, bricks, ballHitBrick, null, this);

    // Ajout du texte affichant le niveau et les vies
    levelText = this.add.text(850, 20, "LEVEL : " + level, { fontSize: "24px", fill: "#ffffff" });
    livesText = this.add.text(850, 50, "❤️❤️❤️", { fontSize: "24px", fill: "#ff0000" });
    //  Affichage du compteur de diamants sous les vies
    diamondText = this.add.text(850, 80, "💎: 0", { fontSize: "24px", fill: "#00ffff" });


    // Lancement de la balle au clic
    this.input.on('pointerdown', () => { 
        if (!ballLaunched) {
            ball.setVelocity(200, -200);
            ballLaunched = true;
        }
    });
}

// Création des briques
function createBricks() {
    const brickColors = ["maron", "vert", "noir", "roseViolet", "violet"];
    bricks = this.physics.add.staticGroup(); // Groupe de briques immobiles
    
    for (let y = 0; y < 3; y++) { // 3 rangées de briques
        for (let x = 0; x < 8; x++) { // 8 colonnes
            let colorIndex = (x + y) % brickColors.length; // Alterne les couleurs
            bricks.create(80 + x * 90, 45 + y * 40, brickColors[colorIndex]).setScale(1).refreshBody();
        }
    }
}

// Fonction pour gérer la collision balle - brique
function ballHitBrick(ball, brick) {
    brick.destroy(); // Supprime la brique touchée
    updateDiamonds(1); // Ajoute un diamant à chaque brique cassée
}

// Fonction pour gérer la collision balle - raquette
function ballHitPaddle(ball, paddle) {
    let diff = ball.x - paddle.x; // Calcul de la distance entre la balle et la raquette
    ball.setVelocityX(diff * 5); // Plus on touche le bord, plus l'angle est grand
}

// Réinitialisation de la balle après une perte de vie
function resetBall(scene) { 
    ball.setVelocity(0, 0); // Arrête la balle
    ball.setPosition(paddle.x, paddle.y - 30); // Replace la balle sur la raquette
    ball.setActive(true).setVisible(true); 

    // Relance la balle au clic
    scene.input.once('pointerdown', () => { 
        ball.setVelocity(200, -200);
        ballLaunched = true;
    });
}

// Mise à jour du jeu à chaque frame
function update() {
    // Déplacement de la raquette avec des limites
    if (cursors.left.isDown) {
        paddle.setVelocityX(-400);
    } else if (cursors.right.isDown) {
        paddle.setVelocityX(400);
    } else {
        paddle.setVelocityX(0);
    }

    //  Vérifie si toutes les briques ont été détruites
    if (bricks.countActive() === 0) {
        level++; // Augmente le niveau
        updateLife(); // Met à jour le niveau affiché
        updateDiamonds(1); //  Ajoute un diamant au passage de niveau

        bricks.clear(true, true); //  Supprime toutes les briques avant d'en créer de nouvelles
        createBricks.call(this); // Génère de nouvelles briques
        this.physics.add.collider(ball, bricks, ballHitBrick, null, this);

        resetBall(this); // Replace la balle sur la raquette
        
        let speedMultiplier = 1.2; // ✅ Augmente la vitesse de 20% à chaque niveau
        ball.setVelocity(ball.body.velocity.x * speedMultiplier, ball.body.velocity.y * speedMultiplier);
    }
    
}


// Fonction qui gère la perte de vie
function perdreVie(scene) {
    lives--; // Diminue le nombre de vies
    updateLife(); // Met à jour l'affichage des vies

    if (lives <= 0) {
        // Affichage du message "Game Over"
        scene.add.text(config.width / 2, config.height / 2, "GAME OVER", { 
            fontSize: "48px", fill: "#ff0000" 
        }).setOrigin(0.5);
        
        scene.physics.pause(); // Arrête toute la physique du jeu
    } else {
        ballLaunched = false; // Permet un nouveau lancement
        resetBall(scene); // Replace la balle sur la raquette
    }
}

// Mise à jour du texte des vies et niveaux
function updateLife() {
    // ✅ Met à jour l'affichage du niveau
    levelText.setText("LEVEL : " + level);
    
    // ✅ Met à jour l'affichage des vies
    let hearts = "❤️".repeat(lives); // Génère un texte avec le bon nombre de cœurs
    livesText.setText(hearts);
}

//  Mise à jour du texte des diamants
    function updateDiamonds(amount) {
        diamondCount += amount; // ✅ Ajoute les diamants à la variable globale
        diamondsDisplay.textContent = "💎: " + diamondCount; // ✅ Met à jour le HUD
        diamondText.setText("💎: " + diamondCount); // ✅ Met à jour le texte dans la scène Phaser
    }
    
