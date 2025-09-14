// 各種要素を取得
const submitBtn = document.getElementById("submit-btn");

const timerUpDialog = document.getElementById("time-up-dialog");
const inputCheckDialog = document.getElementById("input-check-dialog");

const closeBtnInputCheckDialog = document.getElementById("close-btn-input-check-dialog");
const closeBtnTimeUpDialog = document.getElementById("close-btn-time-up-dialog");

const turnBtnLeft = document.getElementById("turn-btn-left");
const turnBtnRight = document.getElementById("turn-btn-right");


const leftPlayer = {
    name: "",
    timer: document.getElementById("left-player-timer"),
    isTurn: false
};

const rightPlayer = {
    name: "",
    timer: document.getElementById("right-player-timer"),
    isTurn: false
};

const timerSettings = {
    basicTimeHours: document.getElementById("basic-time-hours").value,
    basicTimeSeconds: document.getElementById("basic-time-minutes").value,
    byoYomi: document.getElementById("byo-yomi").value
};

let mainTimer;


if (leftPlayer.timer > 0 && rightPlayer.timer > 0) {
    const turnBtns = document.querySelectorAll(".turn-btn");
    turnBtns.forEach(turnBtn => {
        turnBtn.addEventListener("click", (event) => {
            event.preventDefault();
            updateTurnBtns();
        });
    });
};


// セットボタン クリック時の処理
submitBtn.addEventListener("click", (event) => {
    event.preventDefault();

    // form に入力された持ち時間の設定を読み取る
    loadTimerSettings();
    // 入力値の検証
    checkInputValues();

    if (checkInputValues()) {        
        // 持ち時間の設定が正しい場合、タイマーをセット
        setClock();
        // 対局中フラグを立て、メインループを開始
        mainTimer = setInterval(moveClock(), 1000);
    } else {
        // 持ち時間の設定が不正な場合、入力チェックダイアログを表示
        inputCheckDialog.show();
    }
});


function resetClock() {
    leftPlayer.timer = 0;
    rightPlayer.timer = 0;
    leftPlayer.isTurn = false;
    rightPlayer.isTurn = false;
    timerSettings.basicTimeHours = 0;
    timerSettings.basicTimeMinutes = 0;
    timerSettings.byoYomiSeconds = 0;
    
    // タイマーの表示を更新
    document.getElementById("left-player-timer").textContent = "0:0";
    document.getElementById("right-player-timer").textContent = "0:0";
    
    // 手番ボタンの色をリセット
    turnBtnLeft.style.backgroundColor = "#ff0000ff";
    turnBtnRight.style.backgroundColor = "#ff0000ff";
    
    // 入力フィールドをリセット
    document.getElementById("basic-timer-hours").value = "";
    document.getElementById("basic-timer-minutes").value = "";
    document.getElementById("byo-yomi").value = "";
    
    // 手番ボタンを無効化
    turnBtnLeft.disabled = true;
    turnBtnRight.disabled = true;
}


function setClock(){
        // 持ち時間を秒に変換
        let basicTimeInSeconds = timeInSeconds(timerSettings.basicTimerHours, timerSettings.basicTimerMinutes);

        //　タイマーを初期化 (持ち時間を代入)
        leftPlayer.timer = basicTimeInSeconds;
        rightPlayer.timer = basicTimeInSeconds;

        // 手番の初期化
        leftPlayer.isTurn = false;
        rightPlayer.isTurn = false;

        updateDisplay();
}


function moveClock(){
    updateTimer();
    updateDisplay();
    // 時間切れ処理
    if (leftPlayer.timer <= 0 || rightPlayer.timer <= 0){
        timerUpDialog.show();
        clearInterval(mainTimer);
        resetClock();
    }
}


function updateTurnBtns(){
    // まだ両者が手番を持っていない場合、クリックイベントを追加
    // 後手がクリックすることで、先手の手番が開始される
    if (!leftPlayer.isTurn && !rightPlayer.isTurn) {
        // 手番ボタンを有効化
        turnBtnLeft.disabled = false;
        turnBtnRight.disabled = false;

        // ボタンの色を初期化
        turnBtnLeft.style.backgroundColor = "#ff0000ff";
        turnBtnRight.style.backgroundColor = "#ff0000ff";

        // 左側のボタンがクリックされたときの処理
        turnBtnLeft.addEventListener("click", function() {
            // 先手の手番が開始する。
            rightPlayer.isTurn = true;
            // 右の手番ボタンをトグルする
            toggleTurnButton(turnBtnRight);
        });

        // 右側のボタンがクリックされたときの処理
        turnBtnRight.addEventListener("click", function() {
            // 先手の手番が開始する。
            leftPlayer.isTurn = true;
            // 左の手番ボタンをトグルする
            toggleTurnButton(turnBtnLeft);
        });

    } else {
        // すでに一方が手番を持っている場合の処理

        // 左側の対局者がボタンを押したときの処理
        turnBtnLeft.addEventListener("click", (event) => {
            event.preventDefault();
            // 左の手番が終了し、右の手番が開始する
            leftPlayer.isTurn = false;
            rightPlayer.isTurn = true;
            
            // 手番ボタンをトグルする
            toggleTurnButton(turnBtnLeft);
            toggleTurnButton(turnBtnRight);
        });

        // 右側の対局者がボタンを押したときの処理
        turnBtnRight.addEventListener("click", (event) => {
            event.preventDefault();
            // 右の手番が終了し、左の手番が開始する
                rightPlayer.isTurn = false;
                leftPlayer.isTurn = true;
                
                // 手番ボタンをトグルする
                toggleTurnButton(turnBtnRight);
                toggleTurnButton(turnBtnLeft);
        });
    }
}


function updateDisplay(){
    document.getElementById("left-player-timer").textContent = timeInText(leftPlayer.timer);
    document.getElementById("right-player-timer").textContent = timeInText(rightPlayer.timer);
}


function updateTimer(){
    if (leftPlayer.isTurn){
        leftPlayer.timer -= 1;
    }
    if (rightPlayer.isTurn){
        rightPlayer.timer -= 1;
    }
}


// form から持ち時間の設定を読み取り、更新する関数
function loadTimerSettings(){
    timerSettings.basicTimerHours = document.getElementById("basic-time-hours").value;
    timerSettings.basicTimerMinutes = document.getElementById("basic-time-minutes").value;
    timerSettings.byoYomiSeconds = document.getElementById("byo-yomi").value;
}


// 持ち時間設定を検査する関数
function checkInputValues() {
    H = timerSettings.basicTimeHours;
    M = timerSettings.basicTimeMinutes;
    S = timerSettings.byoYomiSeconds;
    
    if (H == 0 && M == 0){
        return false;
    } else if (H < 0 || M < 0 || S < 0) {
        return false;
    } else {
        return true;
    }
}


// 手番ボタンをトグルする関数
function toggleTurnButton(button) {
    if (button.disabled === true) {
        button.disabled = false;
        button.style.backgroundColor = "#ff0000ff"; // ボタンの色を有効化
    } else {
        button.disabled = true;
        button.style.backgroundColor = "#666"; // ボタンの色を無効化
    }
}


// 入力チェックダイアログ を閉じる処理
closeBtnInputCheckDialog.addEventListener("click", (event) => {
    event.preventDefault();
    inputCheckDialog.close();
});

// 時間切れダイアログ を閉じる処理
closeBtnTimeUpDialog.addEventListener("click", (event) => {
    event.preventDefault();
    timerUpDialog.close();
});


// "(時間, 分)" を "秒" に変換する関数
function timeInSeconds(hours, minutes) {
    return (parseInt(hours) * 3600) + (parseInt(minutes) * 60);
}

// "秒" を "時間:秒" に変換する関数
function timeInText(seconds) {
    let hours = Math.floor(seconds / 3600); // 時間を計算
    let minutes = Math.floor((seconds %3600) / 60); // 分を計算
    return `${hours}:${minutes}`;
}
