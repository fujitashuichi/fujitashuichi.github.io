// 各種要素を取得
const submitBtn = document.getElementById("submit-btn");

const timeUpDialog = document.getElementById("time-up-dialog");
const inputCheckDialog = document.getElementById("input-check-dialog");

const closeBtnInputCheckDialog = document.getElementById("close-btn-input-check-dialog");
const closeBtnTimeUpDialog = document.getElementById("close-btn-time-up-dialog");

const turnBtnLeft = document.getElementById("turn-btn-left");
const turnBtnRight = document.getElementById("turn-btn-right");

let leftPlayer = {
    timer: 0
}

let rightPlayer = {
    timer: 0
}

let timerSettings = {
    basicTime: 0
}

let currentPlayer;
let timerInterval;


// セットボタン クリック時の処理
submitBtn.addEventListener("click", (event) => {
    event.preventDefault();

    // form に入力された持ち時間の設定を読み取る
    loadTimerSettings();
    // 入力値の検証
    checkInputTimes();

    if (checkInputTimes()) {
        // 持ち時間の設定が正しい場合、タイマーをセット
        setClock();
    } else {
        // 持ち時間の設定が不正な場合、入力チェックダイアログを表示
        inputCheckDialog.show();
    }
});


function setClock(){
        // 時間を設定 (持ち時間を代入)
        leftPlayer.timer = timerSettings.basicTime;
        rightPlayer.timer = timerSettings.basicTime;

        // 時計稼働中にセットボタンを押せないようにする (バグ回避)
        submitBtn.disabled = true;

        updateDisplay();
}


// 手番ボタン がクリックされた時の処理
[turnBtnLeft, turnBtnRight].forEach(button => {
    button.addEventListener("click", (event) => {
        // まだカウントしていないとき (手番がどちらでもないとき)
        if (!currentPlayer) {
            startGame(event);
            return;
        };

        switchPlayer();
    });
});


function startGame(event) {
    currentPlayer = event.target === turnBtnLeft ? "right" : "left";
    if (event.target === turnBtnLeft) {
        turnBtnRight.style.background = "#ff0000";
        turnBtnLeft.disabled = true;
    } else {
        turnBtnLeft.style.background = "#ff0000";
        turnBtnRight.disabled = true;
    }
    timerInterval = setInterval(updateClock, 1000);
}


function updateClock(){
    if (currentPlayer === "left") {
        leftPlayer.timer--
        updateDisplay();
    } else if (currentPlayer === "right") {
        rightPlayer.timer--
        updateDisplay();
    } else {
        alert("something went wrong in function updateTimer() .\n JavaScript: value of currentPlayer is right?");
    };

    if (leftPlayer.timer <= 0 || rightPlayer.timer <= 0) {
        timeUpDialog.show();
    }
}


function updateDisplay(){
    document.getElementById("left-player-timer").textContent = timeInText(leftPlayer.timer);
    document.getElementById("right-player-timer").textContent = timeInText(rightPlayer.timer);
}


function switchPlayer() {
    currentPlayer = currentPlayer === "left" ? "right" : "left";
    toggleTurnButtons();
}


// 手番ボタンをトグルする関数
function toggleTurnButtons() {
    [turnBtnLeft, turnBtnRight].forEach(button => {
        button.disabled = button.disabled === true ? false : true;
        button.style.background = getComputedStyle(button).backgroundColor === "rgb(255, 0, 0)" ? "#777" : "#ff0000";
    });
};


function resetClock() {
    leftPlayer.timer = 0;
    rightPlayer.timer = 0;

    // タイマーの表示をリセット
    document.getElementById("left-player-timer").textContent = "00:00";
    document.getElementById("right-player-timer").textContent = "00:00";

    // 手番ボタンをリセット
    [turnBtnLeft, turnBtnRight].forEach(button => {
        button.style.backgroundColor = "#ccc";
        button.disabled = false;
    });

    // 入力フィールドをリセット
    document.getElementById("basic-timer-hours").value = "";
    document.getElementById("basic-timer-minutes").value = "";
    document.getElementById("byo-yomi").value = "";

    currentPlayer = null;
    clearInterval(timerInterval);
}


// form から持ち時間の設定を読み取り、更新する関数
function loadTimerSettings(){
    hours = document.getElementById("basic-time-hours").value;
    minutes = document.getElementById("basic-time-minutes").value;
    timerSettings.basicTime = parseInt(hours) * 60 * 60 + parseInt(minutes) * 60;
    timerSettings.byoYomi = document.getElementById("byo-yomi").value;
}

// 入力された 持ち時間 を検査する関数
function checkInputTimes() {
    if (timerSettings.basicTime <= 0 || timerSettings.byoYomi < 0){
        return false;
    } else {
        return true;
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
    timeUpDialog.close();
});


// 秒数 を "時間:分:秒" に変換する関数
function timeInText(time) {
    let hours = Math.floor(time / 3600); // 時間を計算
    let minutes = Math.floor((time %3600) / 60); // 分を計算
    let seconds = time % 60;
    return `${hours}:${minutes}:${seconds}`;
}
