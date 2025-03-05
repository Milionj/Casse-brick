const config = {
    type: Phaser.AUTO, // Phaser qui choisit WebGL ou Canvas selon le NAVigateur
    width: 800, // Largeur de la fenêtre
    height: 600, // Hauteur fenêtre
    backgroundColor: "#222222", 

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
        this.load.image("paddle", "img/Screenshot-LBreakout2.jpg"); // caharger l'image de la platforme
    }

     //  crée la platforme dans la scene 
        function create(){
            paddle = this.physics.add.sprite(400, 550, "paddle"); // possition de la raquete
            paddle.setImmovable(true); //la raquette ne bougera pas sous l'éffet de la balle
            paddle.setCollideWorldBounds(true); // Empeche l raquette de sortir de l'éccran
        }

    // Mis a jpurs rien pour l'instant...*

function update(){

}