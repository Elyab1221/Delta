var playerRed="R";
var playerYellow="Y";
var currPlayer=playerRed;

var gameOver=false;
var board;
var rows=6;
var columns=7;
var currColumns=[];

window.onload=function(){
    setGame();
}
function setGame(){
    board=[];
    document.getElementById("board").innerHTML="";
    currColumns=[5,5,5,5,5,5,5];
    for(let r=0;r<rows;r++){
        let row=[];
        for(let c=0;c<columns;c++){
            row.push(' ');
            let title=document.createElement("div");
            title.id=r.toString()+"-"+c.toString();
            title.classList.add("title");
            title.addEventListener("click",setPiece);
            document.getElementById("board").append(title);
        }
        board.push(row);
    }
}
function setPiece(){
    if(gameOver){
        return;
    }
    let coords=this.id.split("-");
    let r=parseInt(coords[0]);
    let c=parseInt(coords[1]);
    r=currColumns[c];
    if(r<0){
        return;
    }
    board[r][c]=currPlayer;
    let title=document.getElementById(r.toString()+"-"+c.toString());
    if(currPlayer==playerRed){
        title.classList.add("red-piece");
        currPlayer=playerYellow;
    }
    else{
        title.classList.add("yellow-piece");
        currPlayer=playerRed;
    }
    r-=1;
    currColumns[c]=r;
    checkWinner();
}
function checkWinner(){
    for(let r=0;r<rows;r++){
        for(let c=0;c<columns-3;c++){
            if(board[r][c] != ' ' ){
                if(board[r][c]==board[r][c+1] && board[r][c+1]==board[r][c+2] && board[r][c+2]==board[r][c+3]){
                    setWinner(r,c,r,c+3);
                    return;
                }
            }
    }
}
 for( let r=0;r<rows-3;r++){
    for(let c=0;c<columns-3;c++){
        if (board[r][c] != ' ' ){
            if(board[r][c]==board[r+1][c+1] && board[r+1][c+1]==board[r+2][c+2] && board[r+2][c+2]==board[r+3][c+3]){
                setWinner(r,c,r+3,c+3);
                return;
            }
        }
    }
 }
 for(let c=0;c<columns;c++){
    for(let r=0;r<rows-3;r++){
        if(board[r][c] != ' '){
            if(board[r][c]==board[r+1][c] && board[r+1][c]==board[r+2][c] && board[r+2][c]==board[r+3][c]){
                setWinner(r,c,r+3,c);
                return;
            }
        }
    }
 }
 for(let r=3;r<rows;r++){
    for(let c=0;c<columns-3;c++){
        if(board[r][c] != ' '){
            if(board[r][c]==board[r-1][c+1] && board[r-1][c+1]==board[r-2][c+2] && board[r-2][c+2]==board[r-3][c+3]){
                setWinner(r,c,r-3,c+3);
                return;
            }
        }
    }
 }
 let isTie=true;
 for ( let c=0;c<columns;c++){
    if(currColumns[c]>=0){
        isTie=false;
        break;
    }
 }
 if(isTie){
    let winner=document.getElementById("winner");
    winner.innerText="Tie Game";
    gameOver=true;
 }
}
function setWinner(r1,c1,r2,c2){
    let winner=document.getElementById("winner");
    if(board[r1][c1]==playerRed){
        winner.innerText="Red Wins";
    }
    else{
        winner.innerText="Yellow Wins";
    }
    gameOver=true;
    drawline(r1,c1,r2,c2);
}
function drawline(r1,c1,r2,c2){
    let tile1=document.getElementById(r1.toString()+"-"+c1.toString());
    let tile2=document.getElementById(r2.toString()+"-"+c2.toString());
    let x1=tile1.offsetLeft+tile1.offsetWidth/2;
    let y1=tile1.offsetTop+tile1.offsetHeight/2;
    let x2=tile2.offsetLeft+tile2.offsetWidth/2;
    let y2=tile2.offsetTop+tile2.offsetHeight/2;
    let distance=Math.hypot(x2-x1,y2-y1);
    let angle=Math.atan2(y2-y1,x2-x1);
    let line=document.createElement("div");
    line.id="win-line";
    line.style.width = (distance + 40) + "px";
    line.style.left = (x1 - 20 * Math.cos(angle)) + "px";
    line.style.top = (y1 - 20 * Math.sin(angle) - 7) + "px";
    line.style.transform = `rotate(${angle}rad)`;
    document.getElementById("board").appendChild(line);
}
function restartGame(){
    gameOver=false;
    currPlayer=playerRed;
    document.getElementById("winner").innerText="";
    document.getElementById("board").innerHTML="";
    setGame();
}