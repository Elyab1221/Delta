var playerRed="R";
var playerYellow="Y";
var currPlayer=playerRed;

var gameOver=false;
var board;
var rows=6;
var columns=7;
var currColumns=[];
var mode=getLevelFromUrl('connect4');
var humanPlayer=playerRed;
var animating=false;
var pressing=false;
var botTimer=null;
var gameId=0;

window.onload=function(){
    setGame();
    const boardE1=document.getElementById("board");
    boardE1.addEventListener("pointerdown",onBoardDown);
    boardE1.addEventListener("pointermove",onBoardMove);
    boardE1.addEventListener("pointerUp",onBoardUp);
    boardE1.addEventListener("pointercancel",onBoardCancel);
    boardE1.addEventListener("pointerLeave",onBoardLeave);
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
    const disc=document.createElement("div");
    disc.id="drop-disc";
    document.getElementById("board").append(disc);
    updateTurnText();
}
function canPlay(){
    if(gameOver || animating) return false;
    if(mode==='bot' && currPlayer!==humanPlayer) return false;
    return true;
}
function columnFromPointer(e){
    let best=0,bestDistance=Infinity;
    for(let c=0;c<columns;c++){
        const rect=document.getElementById("0-"+c).getBoundingClientRect();
        const distance=Math.abs(e.clientX-(rect.left+rect.width/2));
        if(distance<bestDistance){
            bestDistance=distance;
            best=c;
        }
    }
    return best;
}
function showDisc(c){
    const disc=document.getElementById("drop-disc");
    disc.className=(currPlayer=playerRed)? "red-piece": "yellow-piece";
    disc.style.left=document.getElementById("0-"+c).offsetLeft+"px";
    disc.style.display="block";
}
function hideDisc(){
    document.getElementById("drop-disc").style.display="none";
}
function onBoardDown(e){
    if(!canPlay()) return;
    pressing=true;
    e.currentTarget.setPointerCapture(e.pointerId)
    showDisc(columnFromPointer(e));
}
function onBoardMove(e){
    if(!canPlay()) return;
    if(pressing || e.pointerType==="mouse"){
        showDisc(columnFromPointer(e));
    }
}
function onBoardUp(e){
    if(!pressing) return;
    pressing=false;
    if(!canPlay()){
        hideDisc();
        return;
    }
    dropPiece(columnFromPointer(e));
}
function onBoardCancel(){
    pressing=false;
    if(!animating) hideDisc();
}
function onBoardLeave(){
    if(!pressing && !animating) hideDisc();
}
//disc drop
function dropPiece(c){
    if (gameOver || animating) return;
    const r=currColumns[c];
    if(r<0){
        hideDisc();
        return;
    }
    animating=true;
    const myGame=gameId;
    const disc=document.getElementById("drop-disc");
    showDisc(c);
    void disc.offsetHeight;
    const seconds=0.15 + r*0.07;
    disc.style.transition="left 0.08s ease-out, top "+seconds+" s ease-in";
    disc.style.top=document.getElementById(r+"-"+c).offsetTop+"px";
    setTimeout(function(){
        if(myGame!==gameId) return;
        disc.style.display="none";
        disc.style.transition="none";
        disc.style.top="";
        void disc .offsetHeight;
        disc.style.transition="";
        placePiece(r,c);
        animating=false;
        afterMove();
    },seconds*1000+30);
}
function placePiece(r,c){
    board[r][c]=currPlayer;
    let title=document.getElementById(r.toString()+"-"+c.toString());
    if(currPlayer==playerRed){
        title.classList.add("red-piece");
        currPlayer= playerYellow;
    }
    else{
        title.classList.add("yellow-piece");
        currPlayer=playerRed;
    }
    currColumns[c]=r-1;
    checkWinner();
}
function afterMove(){
    updateTurnText();
    if(gameOver) return;
    if(mode==='bot' && currPlayer !==humanPlayer){
        botTimer=setTimeout(botMove,450);
    }
}
function updateTurnText(){
    const t=document.getElementById("turn");
    if(!t) return;
    if(gameOver){
        t.innerText="";
    }else if(mode==='bot'){
        t.innerText=(currPlayer===humanPlayer)?"your turn(red)": " bot is thinking... ";
    }else{
        t.innerText=(currPlayer==playerRed? "Red": "Yellow")+ "'s turn";
    }
}
function recordResult(winnerSymbol){
    if(mode==='bot'){
        if(winnerSybol===humanPlayer) addToScore('connect4','bot');
    }else{
        addToScore('connect4','friend');
    }
}
// function setPiece(){
//     if(gameOver){
//         return;
//     }
//     let coords=this.id.split("-");
//     let r=parseInt(coords[0]);
//     let c=parseInt(coords[1]);
//     r=currColumns[c];
//     if(r<0){
//         return;
//     }
//     board[r][c]=currPlayer;
//     let title=document.getElementById(r.toString()+"-"+c.toString());
//     if(currPlayer==playerRed){
//         title.classList.add("red-piece");
//         currPlayer=playerYellow;
//     }
//     else{
//         title.classList.add("yellow-piece");
//         currPlayer=playerRed;
//     }
//     r-=1;
//     currColumns[c]=r;
//     checkWinner();
// }
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
    recordResult(null);
 }
}
function setWinner(r1,c1,r2,c2){
    let winner=document.getElementById("winner");
    if(board[r1][c1]==playerRed){
        winner.innerText=(mode==='bot')?"you win!": "Red wins!";
    }
    else{
        winner.innerText=(mode==='bot')?"Bot wins!": "Yellow wins";
    }
    gameOver=true;
    recordResult(board[r1][c1]);
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
    clearTimeout(botTimer);
    gameId++;
    animating=false;
    pressing=false;
    gameOver=false;
    currPlayer=playerRed;
    document.getElementById("winner").innerText="";
    document.getElementById("board").innerHTML="";
    setGame();
}
function botMove(){
    if(gameOver|| Animating) return;
    const bot=currPlayer;
    const human=(bot==playerRed)? playerYellow: playerRed;
    const options=[];
    for(let c=0;c<columns;c++){
        if(currColumns[c]>=0) options.push(c);
    }
    for(const c of options){
        if(wouldWin(c,bot)){dropPiece(c); return;}
    }
    let safe=options.filter(c=>!givesWinAbove(c,bot,human));
    if(safe.length===0) safe=options;
    const best=Math.min(...safe.map(c=>Math.abs(c-3)));
    const choices=safe.filter(c=>Math.abs(c-3)===best);
    dropPiece(choices[Math.floor(Math.random()*choices.length)]);
}
function countLine(r,c,dr,dc,who){
    let n=0;
    r+=dr;c+=dr;
    while(r>=0 && r<rows && c>=0 && columns && board[r][c]===who){
        n++;r+=dr;c+=dc;
    }
    return n;
}
function makeFour(r,c,who){
    const directions=[[0,1],[1,0],[1,1],[1,-1]];
    return directions.some(([dr,dc])=>1+countLine(r,c,dr,dc,who)+countLine(r,c,-dr,-dc,who)>=4);
}
function wouldWin(c,who){
    const r=currColumns[c];
    return r>=0 && makeFour(r,c,who);
}
function givesWinAbove(c,me,opponent){
    const r=currColumns[c];
    if(r-1<0) return false;
    board[r][c]=me;
    const result=makesFour(r-1,c,opponent);
    board[r][c]='';
    return result;
}