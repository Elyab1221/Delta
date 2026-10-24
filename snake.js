const gameboard=document.querySelector("#gameboard");
const ctx= gameboard.getContext("2d");
const scoreText= document.querySelector("#score");
const resetg= document.querySelector("#resetsc");
const gameWidth= gameboard.width;
const gameHeight=gameboard.height;
const boardBackground="white";
const snakeColor="black";
const snakeBorder="white";
const foodColor="red";
const unitsize=25;
let timer;
let running= false;
let xvelocity= unitsize;
let yvelocity= 0;
let foodx;
let foody;
let score=0;
let snake =[
    {x:unitsize*4, y:0},
    {x:unitsize*3, y:0},
    {x:unitsize*2, y:0},
    {x:unitsize, y:0},
    {x:0,y:0},    
];

window.addEventListener("keydown",changeDirection);
resetg.addEventListener("click",resetGame);
gameStart();
// createFood();

function gameStart(){
    running=true;
    scoreText.textContent=score;
    createFood();
    drawFood();
    nextTick();
};
function nextTick(){
    if(running){
        timer=setTimeout(()=>{
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        },80)
    }
    else{
        displayGameOver();
    }
};
function clearBoard(){
    ctx.setTransform(1,0,0,1,0,0);
    ctx.fillStyle=boardBackground;
    ctx.fillRect(0,0,gameWidth,gameHeight);
};
function createFood(){
    function randomFood(min,max){
        const randNum=Math.round((Math.random()*(max-min)+min)/unitsize)*unitsize;
        return randNum;
    };
    do{
    foodx=randomFood(0,gameWidth-unitsize);
    foody=randomFood(0,gameHeight-unitsize);}
    while(snake.some(p=>p.x==foodx && p.y==foody));
};
function drawFood(){
    ctx.fillStyle=foodColor;
    ctx.fillRect(foodx,foody,unitsize,unitsize);
};
function moveSnake(){
    const head={x:snake[0].x+xvelocity,
                y:snake[0].y+yvelocity};

        snake.unshift(head);
        if(snake[0].x==foodx && snake[0].y==foody){
            score+=1;
            scoreText.textContent=score;
            createFood();
        }
        else{
            snake.pop();
        }
    }
function drawSnake(){
    ctx.fillStyle=snakeColor;
    ctx.strokeStyle=snakeBorder;
    snake.forEach(snakepart=>{
        ctx.fillRect(snakepart.x,snakepart.y,unitsize,unitsize);
        ctx.strokeRect(snakepart.x,snakepart.y,unitsize,unitsize);

    })
    drawHead(snake[0]);
};
function drawHead(part){
    const u=unitsize;
    ctx.save();
    ctx.translate(part.x + u/2,part.y+u/2);
    ctx.rotate( Math.atan2(yvelocity,xvelocity));
    // eyes
    ctx.fillStyle="white";
    ctx.beginPath();
    ctx.arc(1,-6,4,0, Math.PI*2);ctx.fill();
    ctx.beginPath();
    ctx.arc(1,6,4,0, Math.PI*2);ctx.fill();

    ctx.fillStyle="black";
    ctx.beginPath();ctx.arc(2.5,-6,2,0,Math.PI*2); ctx.fill();
    ctx.beginPath();ctx.arc(2.5,6,2,0,Math.PI*2); ctx.fill();

    //mouth
    ctx.strokeStyle="red";
    ctx.lineWidth=2;
    ctx.beginPath();
    ctx.moveTo(7,-4);
    ctx.quadraticCurveTo(11,0,7,4);
    ctx.stroke();

    ctx.restore();

}
function changeDirection(event){
    const keyPressed=event.keyCode;
    const LEFT=37;
    const UP=38;
    const RIGHT=39;
    const DOWN=40;

    const goUp=(yvelocity== -unitsize);
    const goDown=(yvelocity== unitsize);
    const goRight=(xvelocity== unitsize);
    const goLeft=(xvelocity== -unitsize);

    switch(true){
        case((keyPressed==LEFT || keyPressed==65) && !goRight):
            xvelocity= -unitsize;
            yvelocity=0;
            break
        case((keyPressed==UP || keyPressed==87) && !goDown):
            xvelocity= 0;
            yvelocity=-unitsize;
            break
        case((keyPressed==RIGHT || keyPressed==68) && !goLeft):
            xvelocity= unitsize;
            yvelocity= 0;
            break
        case((keyPressed==DOWN || keyPressed==83) && !goUp):
            xvelocity= 0;
            yvelocity=unitsize;
            break
    }

};
function checkGameOver(){
    switch(true){
        case(snake[0].x<0):
            running=false;
            break;
        case(snake[0].x>=gameWidth):
            running=false;
            break ; 
        case(snake[0].y<0):
            running=false;
            break;
        case(snake[0].y>=gameHeight):
            running=false;
            break;
}
for(let i=1;i<snake.length;i++){
    if(snake[i].x==snake[0].x && snake[i].y == snake[0].y){
        running=false;
    }
}
}
function displayGameOver(){
    ctx.font= "50px MV Boli";
    ctx.fillStyle="black";
    ctx.textAlign="center";
    ctx.fillText("GAME OVER!", gameWidth/2, gameHeight/2);
    running=false;
};
function resetGame(){
    clearTimeout(timer);
    score=0;
    xvelocity=unitsize;
    yvelocity=0;
    snake =[
    {x:unitsize*4, y:0},
    {x:unitsize*3, y:0},
    {x:unitsize*2, y:0},
    {x:unitsize, y:0},
    {x:0,y:0},    
];
gameStart();
};


