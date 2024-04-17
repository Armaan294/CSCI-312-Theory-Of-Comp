//board
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

//dino
let dinoWidth = 88;
let dinoHeight = 94;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let dinoImg;

let dino = {
    x: dinoX,
    y: dinoY,
    width : dinoWidth,
    height : dinoHeight
}

//Cactus implementation
let catcusArray = [];

let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;

let cactusHeight = 70;
let cactusX = 700;
let cactusY = boardHeight - cactusHeight;

let cactus1Img;


window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d") //used to draw on the board

    //Placement of the dinosaur at the beginning of the game


    dinoImg = new Image();
    dinoImg.src = "./img/dino.png";
    dinoImg.onload = function(){
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    }

    cactus1Img = new Image();
    cactus1Img.src = "./img/cactus1.png";



    requestAnimationFrame(update);
    setInterval(placeCactus, 1000); //Function is called every second to generate cactus
}

function update() {
    requestAnimationFrame(update);

    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

}

function placeCactus() {

    //place the cactus down
    let cactus = {
        img : null
        x : cactusX,
        y: cactusY,
        width : null,
        height: cactusHeight
    }

    letplaceC

}