const gameInfo={
    snake:{
        title: 'snake',
        help:`<p><b> Goal:</b> eat the food to grow.dont crash!</p>
        <p><b> Computer: </b> arrow keys or W A S D to move,p to pause and r to restart.(for pc).</P>
        <p><b> Phone: </b> use the on-screen controls(for mobile).</p>
        <p><b> Levels: </b> easy,medium and hard based on how fast the snake moves.</p>`,
    },
    tetris:{
        title:'tetris',
        help:
        `<p><b> Goal:</b> fill whole rows with blocks to clear them . your score is the number of rows cleared.</p>
        <p><b>Computer: </b> &larr; &rarr; move,&uarr;rotate,&darr;fall faster, space dropos the piece instantly,p pauses,R restarts.</p>
        <p><b>Phone: </b> use the pad under board: &#8635; rotates, &larr; &rarr; move, &darr; falls faster, DROP in the middle drops the piece.</p>
        <p><b> pick a level to start(1-10)</b>, the more the level the faster the pieces fall</p>`
},
};
let currentGame=null;
const selectedLevel={}
function $(id){
    return document.getElementById(id);
}
function showScreen(id){
    document.querySelectorAll('.screen').forEach((screen)=>{
        screen.hidden=screen.id!==id;
    });
}

function showPanel(name){
    document.querySelectorAll('.panel').forEach((panel)=>{
        panel.hidden=panel.id!=='panel-' +name
    });
    if(name=='score'){
        renderScores();
    }
}
function levelLabel(game,level){
    return game==='snake'
    ?level[0].toUpperCase()+level.slice(1)
    : 'level '+level;
}

function loadSelectedLevel(game){
    const saved=hubGet('hub-level-'+game);
    const found=HUB_LEVELS[game].find((level)=>String(level)===saved);
    return found!==undefined?found:HUB_LEVELS[game][0];
}
function playUrl(game){
    return `${game}.html?level=${selectedLevel[game]}`;
}
function updateLevelInfo(){
    $('levelInfo').textContent='selected: '+levelLabel(currentGame,selectedLevel[currentGame]);
}
function renderLevels(){
    const box=$('levelButtons');
    box.innerHTML='';
    HUB_LEVELS[currentGame].forEach((level)=>{
        const buttton=document.createElement('button');
        buttton.className='lvl'+(level===selectedLevel[currentGame]?' selected':'');
        buttton.textContent= currentGame==='snake'?levelLabel('snake',level):level;
        buttton.addEventListener('click',()=>{
            selectedLevel[currentGame]=level;
            hubSet('hub-level-'+currentGame,String(level));
            renderLevels();
            updateLevelInfo();
        });
        box.appendChild(buttton);
    });
}
function renderScores(){
    const list=$('scoreList');
    list.innerHTML='';
    HUB_LEVELS[currentGame].forEach((level)=>{
        const item=document.createElement('li');
        const name=document.createElement('span');
        const score=document.createElement('b');
        name.textContent=levelLabel(currentGame,level);
        score.textContent=getHighScore(currentGame,level);
        item.append(name,score);
        list.appendChild(item);
    });
}
function openGame(game){
    currentGame=game;
    selectedLevel[game]=loadSelectedLevel(game);
    $('menuTitle').textContent=gameInfo[game].title;
    $('helpText').innerHTML=gameInfo[game].help;
    renderLevels();
    updateLevelInfo();
    showPanel('level');
    showScreen('menu');
}
$('startBtn').addEventListener("click",()=>showScreen('games'));
$('backToLanding').addEventListener("click",()=>showScreen('landing'));
$('backToGames').addEventListener("click",()=>showScreen('games'));

document.querySelectorAll('.card').forEach((card)=>{
    card.addEventListener('click',()=>openGame(card.dataset.game));
});

document.querySelectorAll('#menu [data-action]').forEach((button)=>{
    button.addEventListener('click',()=>{
        const action=button.dataset.action;
        if(action=='play'){
            window.location.href=playUrl(currentGame);
        }else{
            showPanel(action);
        }
    });
});

const hash=window.location.hash.slice(1);
if(gameInfo[hash]){
    openGame(hash);
}else if (hash==='games'){
    showScreen('games');
}else{
    showScreen('landing');
}
