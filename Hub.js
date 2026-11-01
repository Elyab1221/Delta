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
        `<p><b> Goal:</b> fill whole rows with blocks to clear them . every row you clear gives you equal to your current level so the higher the level the more each row is worth.</p>
        <p><b>Computer: </b> &larr; &rarr; move,&uarr;rotate,&darr;fall faster, space dropos the piece instantly,p pauses,R restarts.</p>
        <p><b>Phone: </b> use the pad under board: &#8635; rotates, &larr; &rarr; move, &darr; falls faster, DROP in the middle drops the piece.</p>
        <p><b> pick a level to start(1-10)</b>, the more the level the faster the pieces fall</p>`
},
flappy:{
    title:'flappy bird',
    help:`<p><b> Goal:</b> fly through the gaps between the pipes without touching them.every pair of pipes you pass gets you 1 point.</p>
    <p><b> computer:</b> space ,&uarr; or x to flap.after a crash presss space to try again.</p>
    <p><b> phone: </b> tap the screen to flasp . tap again after a crash to restart.</p>
    <p><b> Levels:</b> easy, medium and hard . the harder the level , the faster the pipes tmove and the narrower the narrower the gap between them.</p>`,
},
tic:{
    title:'tic-tac toe',
    levelPrompt:' choose who to play with: ',
    help: `<p><b> Goal: </b> get 3 of your marks in a row(across, down or diagonal) before your opponent does.</p>
    <p><b> how to play: </b> click or tap an empty square to place your mark. X always starts first</P>
    <p><b> Levels: </b> play with a friend( you take turns on the same screen) or play with a bot(you are X)</p>
    <p><b> Highscore: </b> with the bot it counts your wins with a friend it counts the games you have finished</p>`,
},
connect4:{
    title:'connect 4',
    levelPrompt:' choose who to play with: ',
    help:`<p><b> Goal: </b> the first to connect 4 discs in a row(acrosss,down or siagonally) wins.</p>
    <p><b> Computer: </b> move the mouse over the board , the disc follows it at the top. click to let it fall</P>
    <p><b> Phone: </b> touch the board and slide your finger left or right to move the disc , lift your finger to drop it. </p>
    <p><b> Level: </b> play with a friend (red starts ,then yellow) or play  with a bot(you are red).</p>
    <p><b> Highscore: </b> with a bot it conts your wins, with a friend it counts the games you finished. </P>`,
}}
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
const LEVEL_NAMES = {
    friend: 'play with a friend',
    bot: 'play with a bot',
}
function levelLabel(game,level){
    if(LEVEL_NAMES[level]) return LEVEL_NAMES[level];
    return typeof level==='string'
    ? level[0].toUpperCase()+ level.slice(1):
    'level'+level;
}
function scoreLabel(game,level){
    if(level==='friend') return 'with a friend (games finished)';
    if(level==='bot') return 'with a bot (games won) ';
    return levelLabel(game,level);
}
function loadSelectedLevel(game){
    const saved=hubGet('hub-level-'+game);
    const found=HUB_LEVELS[game].find((level)=>String(level)===saved);
    return found!==undefined?found:HUB_LEVELS[game][0];
}
const GAME_PAGES={
    snake: 'snake/snake.html',
    tetris:'tetris/tetris.html',
    flappy:'flappy bird/flappy.html',
    tic: 'tic tac toe/tic.html',
    connect4: 'connect4/conn.html',
};
function playUrl(game){
    return encodeURI(`${GAME_PAGES[game]}?level=${selectedLevel[game]}`);
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
        buttton.textContent= typeof level==='string'? levelLabel(currentGame,level): level;
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
        name.textContent=scoreLabel(currentGame,level);
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
    document.querySelector('#panel-level p').textContent=gameInfo[game].levelPrompt || 'pick a level:';
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
