let board;
let boardWidth=360;
let boardHeight=640;
let context;
let birdWidth=34;
let birdHeight=24;
let birdX=boardWidth/8;
let birdY=boardHeight/2;
let birdImg;

let bird={
    x:birdX,
    y:birdY,
    width:birdWidth,
    height:birdHeight
}

let pipeArray=[];
let pipeWidth=64;
let pipeHeight=512;
let pipeX=boardWidth;
let pipeY=0;
let topPipeImg;
let bottomPipeImg;
let velocityX=-2;
let velocityY=0;
let gravity= 0.4;
let gameOver=false;
let score=0;
let pipeTimer=0;
let lastTime=0;

window.onload=function(){
    board=document.getElementById("board");
    board.height=boardHeight;
    board.width=boardWidth;
    context=board.getContext("2d");
    
    birdImg=new Image();
    birdImg.src="./flappybird.png";
    birdImg.onload=function(){
        context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);
    }
    topPipeImg=new Image();
    topPipeImg.src="./toppipe.png";
    bottomPipeImg= new Image();
    bottomPipeImg.src="./bottompipe.png";
    requestAnimationFrame(update);
    // setInterval(placePipes,1500);
    document.addEventListener("keydown",moveBird);
    board.addEventListener("pointerdown",function(e){
        e.preventDefault();
        moveBird({code:"Space"});});
    // },{passive:false});
}
function update(time){
    requestAnimationFrame(update);
    let delta=(time-lastTime)/16.66;
    lastTime=time;
    if(delta>3){
        delta=3;
    }
    if(gameOver){
        return;
    }
    pipeTimer+=delta;
    if(pipeTimer>=90){
        placePipes();
        pipeTimer=0
    }
    context.clearRect(0,0,board.width,board.height);
    velocityY+=gravity*delta;
    bird.y=Math.max(bird.y+velocityY*delta,0);
    context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);
    if (bird.y>board.height){
        gameOver= true;
    }

    for(let i=0;i<pipeArray.length;i++){
        let pipe=pipeArray[i];
        pipe.x +=velocityX*delta;
        context.drawImage(pipe.img,pipe.x,pipe.y,pipe.width,pipe.height);

        if(!pipe.passed && bird.x>pipe.x + pipe.width){
            score +=0.5;
            pipe.passed = true;
        }
        if (detectCollision(bird,pipe)){
            gameOver=true;
        }
    }
    while (pipeArray.length >0 && pipeArray[0].x < -pipeWidth){
        pipeArray.shift();
    }
    context.fillStyle= "white";
    context.font="45px Arial";
    context.fillText(score,5,45);
    if(gameOver){
        // context.fillText("Game over!",5,90);
        context.fillStyle="rgba(0,0,0,0.5)";
        context.fillRect(0,0,board.width,board.height);
        context.fillStyle="white";
        context.textAlign="center";
        context.font="45px Arial";
        context.fillText("Game over!",board.width/2,board.height/2);
        context.font="20px Arial";
        context.fillText("tap or press space to restart",board.width/2,board.height/2+40);
        context.textAlign="left";
    }
}
function placePipes(){
    if(gameOver){
        return;
    }
    let randomPipeY=pipeY-pipeHeight/4-Math.random()*(pipeHeight/2);
    let openingSpace= board.height/5;
    let topPipe={
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width:pipeWidth,
        height: pipeHeight,
        passed:false
    }
    pipeArray.push(topPipe);
    let bottomPipe={
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY+pipeHeight+openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(bottomPipe);
}
function moveBird(e){
    if(e.code=="Space" || e.code=="ArrowUp" || e.code=="KeyX"){
        velocityY=-6;
        if (gameOver){
            bird.y=birdY;
            pipeArray=[];
            score=0
            gameOver=false;
        }
    }
}
function detectCollision(a,b){
    return a.x<b.x + b.width &&
           a.x+a.width > b.x &&
           a.y<b.y + b.height &&
           a.y+a.height > b.y;
}