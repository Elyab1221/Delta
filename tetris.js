const shapes=[
    //I
 [  [0,0,0,0],
    [1,1,1,1],
    [0,0,0,0],
    [0,0,0,0],
],
//J
[
    [1,0,0],
    [1,1,1],
    [0,0,0],
],
//L
 [  [0,0,1],
    [1,1,1],
    [0,0,0],
],
//0
 [  [1,1],
    [1,1],
],
//S
 [  [0,1,1],
    [1,1,0],
    [0,0,0],
],
//Z
 [  [1,1,0],
    [0,1,1],
    [0,0,0],
],
//T
 [  [1,1,1],
    [0,1,0],
    [0,0,0],
],
];
const shapeColors=[
    'aqua',
    'blue',
    'orange',
    'yellow',
    'green',
    'red',
    'purple',
]
const colorSideBorder= 'white';
const colorEmptyBlock= 'gray';
const colorGameOverOverlay= 'rgba(0,0,0,0.75)';
const colorFont= 'white';
const blockSize=30;
const blockBackground= 'rgb(100, 100, 100)';
const gravity=10;
const gravacc=0.00001;
const gravTreshold= 1000;

const gridCol=10;
const gridRow=20;

const sidebarBorder=20
const sidebarWidthBlock= 6;
const inputKeys={
    ArrowLeft: 'moveLeft',
    ArrowRight: 'moveRight',
    ArrowDown: 'moveDown',
    ArrowUp:'rotate',
    ' ': 'hardDrop',
    r: 'restart',
};
const noRepeatInputs=['rotate','hardDrop']
const width= gridCol*blockSize;
const height= gridRow*blockSize;
const sidebarWidth= sidebarWidthBlock*blockSize;
const sidebarContentX= width+sidebarBorder+blockSize;
const sidebarContenty= blockSize;
const canvasWidth= width+sidebarBorder+sidebarWidth;
const canvasHeight= height;
const blockEmpty=-1;
const inputinitial=0
const inputCharging=1;
const inputRepeating=2;
const inputRepeatTreshold=170;
const inputRepeatInterval=50;

function getRandomIndex(n){
    return Math.floor(Math.random()*n);
}
function getRandomShapeId(){
    return getRandomIndex(shapes.length);
}

function makeEmptyGrid(){
    return Array.from({length:gridRow},()=>
        Array(gridCol).fill(blockEmpty));
};
function createCurrentPieces(shapeId){
    const shape= shapes[shapeId];
    return {
        shapeId,
        shape,
        position:{
            x:getRandomIndex(gridCol-shape[0].length+1),
            y:0
        },
    };
}
function getInitialState(){
    return {
        isGameOver:false,
        isPaused:false,
        score: 0,
        gravity:{
            progress:0,
            speed:gravity,
        },
        currentPiece: createCurrentPieces(getRandomShapeId()),
        nextShapeId: getRandomShapeId(),
        grid: makeEmptyGrid()
    };
}
function canGridFitShape(grid,shape,shapex,shapey){
    return shape.every((row,i)=>{
        const gridy=shapey+i;
        return row.every((isSolid,j)=>{
            if (!isSolid){
                return true;
            }
            //collision
            if(gridy>=grid.length){
                return false;
            }
            const gridx=shapex+j;
            if (gridx<0 || gridx>=grid[0].length){
                return false;
            }
            return grid[gridy][gridx]===blockEmpty;
        });
    });
}
function moveCurrentPiece(grid,currentPiece,movex,movey){
    const {shape,position}= currentPiece;
    const {x,y}= position;
    const canMove =canGridFitShape(grid,shape,x+movex,y+movey);

    if(canMove){
        position.x+=movex;
        position.y+=movey;
    }
    return canMove;
}
function attachToGrid(grid,currentPiece){
    const {shapeId,shape,position}=currentPiece;

    for (let i=0;i<shape.length;i++){
        for(let j=0;j<shape[0].length;j++){
            if(shape[i][j]){
                grid[position.y+i][position.x+j]=shapeId;
            }
        }
    }
}

function clearCompleteLines(grid){
    let clearedLines=0;

    for(let i=grid.length-1;i>=0;i--){
        if (grid[i].every((cell)=>cell!==blockEmpty)){
            clearedLines++;
        }else if(clearedLines>0){
            grid[i+clearedLines]=[...grid[i]];
        }
    }
    for(let i=0;i<clearedLines;i++){
        grid[i].fill(blockEmpty);
    }
    return clearedLines;
}
function handleCurrentPieceLanding(state){
    attachToGrid(state.grid,state.currentPiece);

    const clearedLines=clearCompleteLines(state.grid);
    state.score+=clearedLines;

    const newPiece=createCurrentPieces(state.nextShapeId);
    const {shape,position} =newPiece;

    if(canGridFitShape(state.grid,shape,position.x,position.y)){
        state.currentPiece=newPiece;
        state.nextShapeId=getRandomShapeId();
    }
    else{
        state.isGameOver=true;
    }
}
function moveCurrentPieceDown(state){
    state.gravity.progress=0;

    const didmove=moveCurrentPiece(state.grid,state.currentPiece,0,1);
    if(!didmove){
        handleCurrentPieceLanding(state);
    }
    return didmove;
}
function rotate(shape){
    return Array.from({length:shape[0].length},(_,i)=>
        Array.from(
            {length:shape.length},
            (_,j)=>shape[shape.length-1-j][i]
        )
);
}
function rotateCurrentPiece(grid,currentPiece){
    const {shape,position}=currentPiece;

    const newShape=rotate(shape);
    if(canGridFitShape(grid,newShape,position.x,position.y)){
        currentPiece.shape=newShape;
    }
}
function resetGameState(state){
    Object.assign(state,getInitialState());
}
function updateGravity(state,dt){
    state.gravity.speed+= gravacc*dt;
    state.gravity.progress +=state.gravity.speed*dt;

    if(state.gravity.progress>=gravTreshold){
        moveCurrentPieceDown(state);
    }
}
function handleInputState(input,dt,canRepeat=true){
    if(!input){
        return false;
    }
    // if(!canRepeat){return false;}
    input.timer+=dt;

    switch(input.state){
        case inputinitial:
            input.state=inputCharging;
            input.timer=0;
            return true;
        case inputCharging:
            if(!canRepeat){return false;}
            const ischarged=input.timer>=inputRepeatTreshold;
            if(ischarged){
                input.state=inputRepeating;
                input.timer=0;
            }
            return ischarged;
        case inputRepeating:
            if(!canRepeat){return false;}
            const shouldRepeat=input.timer>=inputRepeatInterval;
            if(shouldRepeat){
                input.timer=0;
            }
        return shouldRepeat;
    }
}
function updateCurrentPiece(state,inputs,dt){
    const{grid,currentPiece}=state;
    const isInputActive=(inputType)=>handleInputState(inputs[inputType],dt,!noRepeatInputs.includes(inputType));

    if(isInputActive('moveLeft')){
        moveCurrentPiece(grid,currentPiece,-1,0);
    }
    if(isInputActive('moveRight')){
        moveCurrentPiece(grid,currentPiece,1,0);
    }
    if(isInputActive('rotate')){
        rotateCurrentPiece(grid,currentPiece);
    }
    if(isInputActive('moveDown')){
        moveCurrentPieceDown(state);
    }
    if(isInputActive('hardDrop')){
        while (moveCurrentPieceDown(state)){}
    }
}
function update(state,inputs,dt){
    if(state.isGameOver || state.isPaused){
        return;
        }
    
        updateCurrentPiece(state,inputs,dt);
        updateGravity(state,dt);
    
    }
function drawBlock(ctx,color,x,y){
    ctx.fillStyle=color;
    ctx.fillRect(x+1,y+1,blockSize-1,blockSize-1)
}
function drawShape(ctx,shape,colorid,x,y){
    const color=shapeColors[colorid];

    for(let i=0;i<shape.length;i++){
        for(let j=0;j<shape[0].length;j++){
            if(shape[i][j]){
                drawBlock(ctx,color,x+j*blockSize,y+i*blockSize);
            }
        }
    }
}
function drawOverlay(ctx,text){
    {
        ctx.fillStyle=colorGameOverOverlay;
        ctx.fillRect(0,0,width,canvasHeight);
        ctx.fillStyle=colorFont;
        ctx.textAlign='center';
        ctx.textBaseline='middle';
        ctx.fillText(text,width/2,canvasHeight/2);
    }
}
function render(ctx,state){
    const {grid,currentPiece,nextShapeId}=state;

    ctx.fillStyle=blockBackground;
    ctx.fillRect(0,0,canvasWidth,canvasHeight);
    
    for(let i=0;i<grid.length;i++){
        for(let j=0;j<grid[0].length;j++){
            const shapeId=grid[i][j];
            const color=shapeId===blockEmpty?colorEmptyBlock:shapeColors[shapeId];
            drawBlock(ctx,color,j*blockSize,i*blockSize);
        }
    }
    drawShape(
        ctx,
        currentPiece.shape,
        currentPiece.shapeId,
        currentPiece.position.x*blockSize,
        currentPiece.position.y*blockSize
    );
    drawShape(
        ctx,
        shapes[nextShapeId],
        nextShapeId,
        sidebarContentX,
        blockSize
    );
    ctx.fillStyle=colorSideBorder;
    ctx.fillRect(width,0,sidebarBorder,canvasHeight);
    ctx.font='bold 32px Arial';
    ctx.fillStyle=colorFont;
    ctx.textAlign='left';
    ctx.textBaseline='top';

    const score=`${state.score}`.padStart(7,'0');
    ctx.fillText('score', sidebarContentX,sidebarContenty+blockSize*5);
    ctx.fillText(score,sidebarContentX,sidebarContenty+blockSize*6);

    if(state.isGameOver){
        drawOverlay(ctx,'game over!');
    }
    else if(state.isPaused){
        drawOverlay(ctx,'paused')
    }
}

function initCanvas(){
    const canvas=document.getElementById('game')
    canvas.width=canvasWidth;
    canvas.height=canvasHeight;
    canvas.style.visibility='visible';

    return canvas.getContext('2d');
}
function newInput(){
    return {state:inputinitial,timer:0};
}
function clearInputs(inputs){
    Object.keys(inputs).forEach((key)=>delete inputs[key]);
}
function startCollectingInputs(inputs,actions){
    window.addEventListener('keydown',(e)=>{
        if(e.repeat||e.ctrlKey||e.metaKey||e.altKey){return;}
    const key=e.key.toLowerCase();
    if(key==='p'){actions.togglePause();return;}
    if(key==='r'){actions.restart();return;}
    
    const inputType=inputKeys[e.key];
    if(inputType){
        e.preventDefault();
        inputs[inputType]=newInput();
    }
});
    window.addEventListener('keyup',(e)=>{
        const inputType=inputKeys[e.key];
        if(inputType){
            inputs[inputType]=undefined;
        }
    });}
function startTouchControls(inputs){
    document.querySelectorAll('#dpad button').forEach((button)=>{
        const inputType=button.dataset.input;
        const press=(e)=>{e.preventDefault(); inputs[inputType]=newInput();};
        const release=()=>{inputs[inputType]=undefined;};

        button.addEventListener('pointerdown',press);
        button.addEventListener('pointerup',release);
        button.addEventListener('pointercancel',release);
        button.addEventListener('pointerleave',release);
        button.addEventListener('contextmenu',(e)=>e.preventDefault());
    });
}
function startMenuButtons(actions){
    const pauseBtn=document.getElementById('pauseBtn');
    pauseBtn.addEventListener('click',actions.togglePause);
    document.getElementById('restartBtn').addEventListener('click',actions.restart);

    //stopping clicked buttons from kept on click like in the orevius version space
    document.querySelectorAll('button').forEach((button)=>{
        button.addEventListener('mousedown',(e)=>e.preventDefault());
    });
    return pauseBtn;
}
function main(){
    const ctx=initCanvas();
    const state=getInitialState();
    const inputs={};
    const actions={
        togglePause(){
            if(state.isGameOver){return;}
            state.isPaused=!state.isPaused;
            clearInputs(inputs);
        },
        restart(){
            resetGameState(state);
            clearInputs(inputs);
        },
    };

    startCollectingInputs(inputs,actions);
    startTouchControls(inputs);
    const pauseBtn=startMenuButtons(actions);
    let previousTime=performance.now();
    function loop(currentTime){
        const MAX_DT=100;
        const dt=Math.min(currentTime-previousTime,MAX_DT);
        previousTime=currentTime;
        update(state,inputs,dt);
        render(ctx,state);
        const label=state.isPaused?'Resume':'Pause';
        if(pauseBtn.textContent!==label){
            pauseBtn.textContent=label;
        }

        requestAnimationFrame(loop);   
    }
    requestAnimationFrame(loop);
}
main()

