//J'ai créé un "canvas" Phaser de 800x600 pixels.
//J'ai chargé une image et on l’a affichée à une position précise (400, 550).
//J'ai activé la physique arcade pour gérer les collisions plus tard.
//J'ai empêché la "raquette" de sortir de l’écran.
// Taille du jeu augmentée (1000x700 px) pour un affichage plus grand.
// Fond plus clair (#444444) pour mieux voir la plateforme noire.

const config = {
    type: Phaser.AUTO, // Phaser qui choisit WebGL ou Canvas selon le NAVigateur
    width: 1000, // Largeur de la fenêtre
    height: 700, // Hauteur fenêtre
    backgroundColor: "#444444", 

    physics: {
        default: "arcade", // Active la physique de type "arcade"
        arcade: {
            gravity: { y: 0 }, // Pas de gravité pour l'instant
            debug: true // Affiche les limites des objets (utile pour voir si tout marche bien)
        }
    },

     scene: {
        preload: preload,
        create: create,
        update: update
     }
    };
    //  création su jeu 
    const game =  new Phaser.Game(config);
    let paddle; // variable pour stocker les platformes 

    //  précharger img
    function preload(){
        this.load.image("paddle", "img/pexels-dmitry-demidov-515774-3784221 1(1).png"); // caharger l'image de la platforme
    }

     //  crée la platforme dans la scene etc.

    let cursors; //  Variable pour stocker les touches du clavier 
    function create(){
            paddle = this.physics.add.sprite(config.width / 2, 650, "paddle"); // possition de la raquete au centre avec width peut importe la largeur 
            paddle.setImmovable(true); //la raquette ne bougera pas sous l'éffet de la balle
            paddle.setCollideWorldBounds(true); // Empeche l raquette de sortir de l'éccran
            paddle.setScale(0.4); // Reduit la taille 

            cursors = this.input.keyboard.createCursorKeys(); // Active les touches du clavier pour déplacer la raquette
        }

function update(){
    // conditions 
    // Si la touche de gauche est pressé 
    if (cursors.left.isDown){
        paddle.setVelocityX(-400); // déplace a droite
    }
    // Si la touche de droite est pressé
    else if (cursors.right.isDown) {
        paddle.setVelocityX(400); // déplace a droite}
    }
    // Si la touche de gauche et de droite ne sont pas pressés
    else{
        paddle.setVelocityX(0); // arretela platforme si aucune touche n'est préssé
    }
}

// 


