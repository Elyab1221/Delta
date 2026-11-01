const cells=document.querySelectorAll('.cell');
const status=document.getElementById('status');
const restartBtn=document.getElementById('restart');
let board=["","","","","","","","",""];
let isGameActive=true;
const player="X";
const BOT="O";
const mode=getLevelFromUrl('tic');
let currentPlayer=player;
let botTimer=null;
function showStartText(){
    status.innerText=mode==='bot'?"your turn": "player X's turn";
}
const winningConditions=[
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];
function handleCellClick(e){
    const cell=e.target;
    const index=parseInt(cell.getAttribute('data-index'));
    if (board[index]!=="" || !isGameActive){
        return;
    }
    makeMove(index,player);
    const winningCombo=checkWin(currentPlayer);
    if (winningCombo){
        winningCombo.forEach(i=>cells[i].classList.add("win"));
        if(mode==='bot'){
            addToScore('tic','bot');
            endGame("you win!");
        }
        else{
            addToScore('tic','friend');
            endGame("player "+ currentPlayer+"wins! ");
        }
        return;
    }
    if(board.every(cell=>cell!=="")){
        if(mode==='friend'){
            addToScore('tic','friend');
        }
        endGame("draw")
        return;
    }
    if(mode==='bot'){
        status.innerText="bot's turn";
        isGameActive=false;
        botTimer=setTimeout(botTurn,500)
    }else{
        currentPlayer=currentPlayer==="X"?"O":"X;"
        status.innerText="player"+currentPlayer+"'s turn";
}}
function botTurn(){
    let BMove=findSMMove();
    makeMove(BMove,BOT);
    const winningCombo=checkWin(BOT);
    if (winningCombo){
        winningCombo.forEach(index=>cells[index].classList.add("win"));
        endGame("bot wins!");
        return;
    }
    if(board.every(cell=>cell!=="")){
        endGame("draw!");
        return;
    }
    status.innerText="your turn";
    isGameActive=true;
}
function findSMMove(){
    for(let combo of winningConditions){
        let count=combo.filter(i=>board[i]===BOT).length;
        let empty=combo.filter(i=>board[i]==="");
        if(count===2 && empty.length===1){
            return empty[0];
        }
    }
    for(let combo of winningConditions){
        let count=combo.filter(i=>board[i]===player).length;
        let empty=combo.filter(i=>board[i]==="");
        if(count===2 && empty.length===1){
            return empty[0];
        }
    }
    if(board[4]===""){
        return 4;
    }
    let emptycells=[];
    board.forEach((val,idx)=>{
        if(val===""){
            emptycells.push(idx);
        }});
    return emptycells[Math.floor(Math.random() * emptycells.length)];
}
function makeMove(index,symbol){
    board[index]=symbol;
    cells[index].innerText=symbol;
    cells[index].classList.add(symbol)
}
function checkWin(symbol){
    let winningCombo= null;
    winningConditions.forEach(combo=>{
        let isWin=combo.every(index=>board[index]===symbol);
        if(isWin){
            winningCombo=combo;
        }
        return isWin;
    });
    return winningCombo;
}
function endGame(message){
    isGameActive=false;
    status.innerText=message;
}
function restartGame(){
    clearTimeout(botTimer);
    board=["","","","","","","","",""];
    isGameActive=true;
    currPlayer=player
    // status.innerText="your turn";
    showStartText();
    cells.forEach(cell=>{
        cell.innerText="";
        cell.classList.remove("X","O","win");
    });
}
cells.forEach(cell=>cell.addEventListener('click',handleCellClick));
restartBtn.addEventListener('click',restartGame);
showStartText();