//board
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;
let name = null;
let localLeaderboardData = JSON.parse(localStorage.getItem("leaderboard")) || [];

//dino
let dinoWidth = 88;
let dinoHeight = 94;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let dinoImg;

//physics 
let velX=-8;
let velY=0;
let gravity=0.4;
let gameOver=false;
let score=0;
let copyOfScore = score;

let dino = {
    x : dinoX,
    y : dinoY,
    width : dinoWidth,
    height : dinoHeight
}

//Cactus implementation
let cactusArray = [];

let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;

let cactusHeight = 70;
let cactusX = 700;
let cactusY = boardHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;



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

    cactus2Img = new Image();
    cactus2Img.src = "./img/cactus2.png";

    cactus3Img = new Image();
    cactus3Img.src = "./img/cactus3.png";
    
    document.getElementById("nameForm").addEventListener("submit", function(event) {
        event.preventDefault();
        name = document.getElementById("nameInput").value;
    });
    document.getElementById("nameForm").addEventListener("submit", function(event) {
        event.preventDefault();
        document.getElementById("nameForm").style.display = "none";
    });

    getLeaderboard();


    requestAnimationFrame(update);
    setInterval(placeCactus, 1000); //Function is called every second to generate cactus
    document.addEventListener("keydown",moveCharacter);
}


function update() {
    requestAnimationFrame(update);
    if(gameOver){
        context.fillStyle="white";
        context.font="30px courier";
        let text = "Game Over";
        let textWidth = context.measureText(text).width;
        let textX = boardWidth/2 - textWidth/2;
        let textY = boardHeight/2;
        context.fillText(text, textX, textY);
        context.font="20px courier";
        text = "Press space to restart";
        textWidth = context.measureText(text).width;
        textX = boardWidth/2 - textWidth/2;
        textY = boardHeight/2 + 30;
        context.fillText(text, textX, textY);
        return;
    }
    else if(name==null){
        context.fillStyle="white";
        context.font="30px courier";
        let text = "Enter your name to start the game";
        let textWidth = context.measureText(text).width;
        let textX = boardWidth/2 - textWidth/2;
        let textY = boardHeight/2;
        context.fillText(text, textX, textY);
        return;
    }
    context.clearRect(0,0,boardWidth,boardHeight);
    //dinosaur
    velY+=gravity;
    dino.y= Math.min(dino.y+velY,dinoY); //apply gravity
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

    //cactus
    for (let i = 0; i < cactusArray.length; i++){
        let cactus = cactusArray[i];
        cactus.x+=velX;
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);
        if(hitObject(dino,cactus)){
            gameOver=true;
        }
    }

    //score
    context.fillStyle="white";
    context.font="20px courier";
    score++;
    context.fillText(score,5,20);

}
function moveCharacter(e){
    if(gameOver){
        gameOver=false;
        dinoX = 50;
        dinoY = boardHeight - dinoHeight;
        cactusArray = [];
        copyOfScore = score;

        localLeaderboardData.push({name: name, score: copyOfScore});
        getLeaderboard();

        score = 0;
        return;
    }
    if((e.code=="Space"||e.code=="ArrowUp")&& dino.y==dinoY){
        velY=-10;
    }

}

function placeCactus() {
    if(gameOver){
        return;
    }
    //place the cactus down
    let cactus = {
        img : null,
        x : cactusX,
        y : cactusY,
        width : null,
        height: cactusHeight
    }

    let placeCactusChance = Math.random();

    if (placeCactusChance > .90) { //10% you get cactus3
        cactus.img = cactus3Img;
        cactus.width = cactus3Width;
        cactusArray.push(cactus);
    }
    else if (placeCactusChance > .70) { //30% you get cactus2
        cactus.img = cactus2Img;
        cactus.width = cactus2Width;
        cactusArray.push(cactus);
    }
    else if (placeCactusChance > .50) { //50% you get cactus1
        cactus.img = cactus1Img;
        cactus.width = cactus1Width;
        cactusArray.push(cactus);
    }
    if(cactusArray.length>5){
        cactusArray.shift();
    }

}

function hitObject(a,b){
    return a.x < b.x +b.width &&
            a.x +a.width > b.x &&
            a.y < b.y + b.height &&
            a.y +a.height > b.y;
}

function getLeaderboard() {
    fetch('/getHighestScores')
        .then(response => response.json())
        .then(data => {
            let copyOfData = data;
            if (name != null) {
                if(data.length < 10 || data[data.length - 1].score < copyOfScore) {
                    copyOfData.push({name: name, score: copyOfScore});
                    fetch('/sendScore', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({name: name, score: copyOfScore}),
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
                }
            }
            if (copyOfData.length >= 11) {
                console.log("deleting");
                copyOfData.sort((a, b) => b.score - a.score);
                fetch('/delete', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({score: copyOfData[10].score}),
                })
            }
            copyOfData = copyOfData.slice(0, 10);
            updateLeaderboard(copyOfData);
        })
        .catch(error => console.error(error));

        score = 0;
}

function updateLeaderboard(leaderboard) {
    const leaderboardTable = document.getElementById('leaderboard');
    leaderboardTable.innerHTML = '<tr><th>Rank</th><th>Name</th><th>Score</th></tr>';

    leaderboard.sort((a, b) => b.score - a.score);
    // Iterate over the leaderboard data and create table rows
    leaderboard.forEach((entry, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.name}</td>
            <td>${entry.score}</td>
        `;
        leaderboardTable.appendChild(row);
    });
}