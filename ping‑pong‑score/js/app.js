let leftScore = 0, rightScore = 0;
let winLeft = 0, winRight = 0;
let serverSide = 'left';
let serveCount = 0;
let timerInterval = null;
let seconds = 0;
let gameOver = false;
let targetWin = null;

const nameLeft = document.getElementById('nameLeft');
const nameRight = document.getElementById('nameRight');
const scoreLeftDom = document.getElementById('scoreLeft');
const scoreRightDom = document.getElementById('scoreRight');
const winLeftDom = document.getElementById('winLeft');
const winRightDom = document.getElementById('winRight');
const timerDom = document.getElementById('timer');
const toggleTimerBtn = document.getElementById('toggleTimerBtn');
const ballLeft = document.getElementById('ballLeft');
const ballRight = document.getElementById('ballRight');
const confirmMask = document.getElementById('confirmMask');
const confirmText = document.getElementById('confirmText');
const confirmOkBtn = document.getElementById('confirmOkBtn');
const confirmCancelBtn = document.getElementById('confirmCancelBtn');
const optionGroup = document.getElementById('optionGroup');
const confirmBtnWrap = document.getElementById('confirmBtnWrap');
const setInfo = document.getElementById('setInfo');

// 按钮DOM
const btnAddLeft = document.querySelector(".team:first-child .add");
const btnSubLeft = document.querySelector(".team:first-child .sub");
const btnAddRight = document.querySelector(".team:last-child .add");
const btnSubRight = document.querySelector(".team:last-child .sub");
const btnResetGame = document.getElementById("btnResetGame");
const btnResetAll = document.getElementById("btnResetAll");
const switchServerBtn = document.getElementById("switchServerBtn");
const toggleTimerBtnDom = document.getElementById("toggleTimerBtn");
const btnOpenSet = document.getElementById("btnOpenSet");

let confirmCallback = null;
function autoScaleLayout(){}
window.addEventListener('resize',autoScaleLayout);
window.addEventListener('orientationchange',autoScaleLayout);

function showConfirm(text, onOk){
    confirmText.innerText = text;
    confirmCallback = onOk;
    confirmMask.classList.add('show');
    optionGroup.style.display = 'none';
    confirmBtnWrap.style.display = 'flex';
}
function closeConfirm(){
    confirmMask.classList.remove('show');
    confirmCallback = null;
}
confirmOkBtn.addEventListener('click',function(e){
    e.stopPropagation();
    const cb = confirmCallback;
    closeConfirm();
    if(cb) cb();
});
confirmCancelBtn.addEventListener('click',function(e){
    e.stopPropagation();
    closeConfirm();
});
confirmMask.addEventListener('click',function(e){
    if(e.target === confirmMask){
        closeConfirm();
    }
});

function toggleTimer(){
    if(timerInterval){
        clearInterval(timerInterval);
        timerInterval = null;
        toggleTimerBtnDom.innerText = "继续计时";
    }else{
        timerInterval = setInterval(()=>{
            seconds++;
            const min = String(Math.floor(seconds/60)).padStart(2,'0');
            const sec = String(seconds%60).padStart(2,'0');
            timerDom.innerText=`比赛时间：${min}:${sec}`;
        },1000);
        toggleTimerBtnDom.innerText = "暂停计时";
    }
}

function openSetSelect(){
    confirmMask.classList.add('show');
    confirmText.innerText = "请选择比赛赛制";
    confirmBtnWrap.style.display = 'none';
    optionGroup.style.display = 'flex';
    optionGroup.innerHTML = "";
    const sets = [
        {name:"3局2胜", val:2},
        {name:"5局3胜", val:3},
        {name:"7局4胜", val:4},
        {name:"不限局数", val:null}
    ];
    sets.forEach(s=>{
        const btn = document.createElement('button');
        btn.innerText = s.name;
        btn.onclick = ()=>{
            targetWin = s.val;
            setInfo.innerText = `赛制：${s.name}`;
            closeConfirm();
        };
        optionGroup.appendChild(btn);
    })
}

function render(){
    scoreLeftDom.innerText = leftScore;
    scoreRightDom.innerText = rightScore;
    winLeftDom.innerText = winLeft;
    winRightDom.innerText = winRight;
    checkWin();
    updateServerTip();
}

function addLeft(){
    if(targetWin !== null && (winLeft >= targetWin || winRight >= targetWin)) return;
    if(gameOver){
        leftScore=0;
        rightScore=0;
        swapPlayer();
        serveCount=0;
        gameOver=false;
        render();
        return;
    }
    leftScore++;
    handleServeAfterPoint();
    render()
}
function subLeft(){
    if(leftScore>0){
        if(gameOver){
            if(leftScore > rightScore){
                winLeft--;
            }else{
                winRight--;
            }
            gameOver = false;
        }
        leftScore--;
        recalcServer();
    }
    render()
}
function addRight(){
    if(targetWin !== null && (winLeft >= targetWin || winRight >= targetWin)) return;
    if(gameOver){
        leftScore=0;
        rightScore=0;
        swapPlayer();
        serveCount=0;
        gameOver=false;
        render();
        return;
    }
    rightScore++;
    handleServeAfterPoint();
    render()
}
function subRight(){
    if(rightScore>0){
        if(gameOver){
            if(rightScore > leftScore){
                winRight--;
            }else{
                winLeft--;
            }
            gameOver = false;
        }
        rightScore--;
        recalcServer();
    }
    render()
}

function handleServeAfterPoint(){
    const total = leftScore + rightScore;
    const deuce = (leftScore >=10 && rightScore >=10);
    serveCount++;
    if( (deuce && serveCount >=1) || (!deuce && serveCount >=2) ){
        serverSide = serverSide === 'left' ? 'right' : 'left';
        serveCount = 0;
    }
}
function recalcServer(){
    const total = leftScore + rightScore;
    const deuce = (leftScore >=10 && rightScore >=10);
    const servePer = deuce ? 1 : 2;
    const totalServes = Math.floor(total / servePer);
    serverSide = (totalServes %2 ===0) ? 'left' : 'right';
    serveCount = total % servePer;
}
function updateServerTip(){
    ballLeft.classList.remove('active');
    ballRight.classList.remove('active');
    if(serverSide === 'left'){
        ballLeft.classList.add('active');
    }else{
        ballRight.classList.add('active');
    }
}
function manualSwitchServer(){
    serverSide = serverSide === 'left' ? 'right' : 'left';
    serveCount = 0;
    updateServerTip();
}
function swapPlayer(){
    const tempName = nameLeft.value;
    nameLeft.value = nameRight.value;
    nameRight.value = tempName;
    const tempWin = winLeft;
    winLeft = winRight;
    winRight = tempWin;
    nameLeft.classList.toggle('name-red');
    nameLeft.classList.toggle('name-blue');
    nameRight.classList.toggle('name-red');
    nameRight.classList.toggle('name-blue');
    scoreLeftDom.classList.toggle('score-red');
    scoreLeftDom.classList.toggle('score-blue');
    scoreRightDom.classList.toggle('score-red');
    scoreRightDom.classList.toggle('score-blue');
}
function checkWin(){
    const diff = Math.abs(leftScore - rightScore);
    if((leftScore >=11 || rightScore >=11) && diff >=2 && !gameOver){
        if(leftScore > rightScore){
            winLeft++;
        }else{
            winRight++;
        }
        gameOver = true;
    }
}
function resetGame(){
    showConfirm("确定要重置本局当前比分吗？胜局将保留。", function(){
        leftScore=0;
        rightScore=0;
        gameOver = false;
        serveCount=0;
        serverSide='left';
        ballLeft.classList.remove('active');
        ballRight.classList.remove('active');
        render();
    });
}
function resetAll(){
    showConfirm("确定要全部清零？比分、胜局、计时全部清空，选手名字保留。", function(){
        leftScore=0;
        rightScore=0;
        winLeft=0;
        winRight=0;
        gameOver=false;
        seconds=0;
        serveCount=0;
        serverSide='left';
        stopTimerInner();
        toggleTimerBtnDom.innerText = "开始计时";
        timerDom.innerText="比赛时间：00:00";
        ballLeft.classList.remove('active');
        ballRight.classList.remove('active');
        render();
    });
}
function stopTimerInner(){
    clearInterval(timerInterval);
    timerInterval=null;
}

// 绑定事件
btnAddLeft.addEventListener("click",addLeft);
btnSubLeft.addEventListener("click",subLeft);
btnAddRight.addEventListener("click",addRight);
btnSubRight.addEventListener("click",subRight);
btnResetGame.addEventListener("click",resetGame);
btnResetAll.addEventListener("click",resetAll);
switchServerBtn.addEventListener("click",manualSwitchServer);
toggleTimerBtnDom.addEventListener("click",toggleTimer);
btnOpenSet.addEventListener("click",openSetSelect);

render();
autoScaleLayout();
