// 各種要素を取得
const setClockBtn = document.getElementById("set-clock-btn");

const timeUpDialog = document.getElementById("time-up-dialog");
const inputCheckDialog = document.getElementById("input-check-dialog");

const closeBtnInputCheckDialog = document.getElementById("close-btn-input-check-dialog");
const closeBtnTimeUpDialog = document.getElementById("close-btn-time-up-dialog");

const turnBtnLeft = document.getElementById("turn-btn-left");
const turnBtnRight = document.getElementById("turn-btn-right");
const turnBtns = [turnBtnLeft, turnBtnRight];

const audios = {
//    timeUp: new Audio(""),
    byoYomi10: new Audio("./audio/num010-000_02_01.wav"),
//    byoYomi20: new Audio(""),
    byoYomi30: new Audio("./audio/jihou_30byou_01.wav"),
//    byoYomi60: new Audio(""),
//    byoYomi120: new Audio("")
};


let leftPlayer = {
    timer: 0,
    isByoYomi: false
}

let rightPlayer = {
    timer: 0,
    isByoYomi: false
}

let players = [leftPlayer, rightPlayer];

let timerSettings = {
    basicTime: 0,
    byoYomi: 0
}

let currentPlayer = null;
let currentAudio = null;
let timerInterval;


// セットボタン クリック時の処理
setClockBtn.addEventListener("click", (event) => {
    event.preventDefault();

    // form に入力された持ち時間の設定を読み取る
    loadTimerSettings();

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

        // 手番ボタンを押せるようにする
        turnBtns.forEach(button => {
            button.disabled = false;
            button.style.translate = "0 -10px";
        });

        // 時計稼働中にセットボタンを押せないようにする (バグ回避)
        setClockBtn.disabled = true;

        updateDisplay();
}


// 手番ボタン がクリックされた時の処理
turnBtns.forEach(button => {
    button.addEventListener("click", (event) => {
        // まだカウントしていないとき (手番がどちらでもないとき)
        if (!currentPlayer) {
            startGame(event);
            return; // switchPlayer() を回避して、手番が正しく設定されるようにしている
        };

        // 読み上げていれば、停止する
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            currentAudio = null;
        };

        switchPlayer();
    });
});


function startGame(event) {
    if (event.target === turnBtnLeft) {
        currentPlayer = rightPlayer;
        turnBtnRight.style.background = "#ff0000";
        turnBtnLeft.disabled = true;
    } else {
        currentPlayer = leftPlayer;
        turnBtnLeft.style.background = "#ff0000";
        turnBtnRight.disabled = true;
    };

    timerInterval = setInterval(updateClock, 1000);
}


function updateClock() {
    if (currentPlayer.timer === 0 || currentPlayer.isByoYomi === true) {
        runByoYomi();
    } else {
        decrementTimer();
    };
}


function updateDisplay(){
    document.getElementById("left-player-timer").textContent = timeInText(leftPlayer.timer);
    document.getElementById("right-player-timer").textContent = timeInText(rightPlayer.timer);
}


function switchPlayer() {
    // 秒読み中は、着手後タイマーが戻る
    if (currentPlayer.isByoYomi) {
        currentPlayer.timer = timerSettings.byoYomi;
        updateDisplay();
    };

    currentPlayer = currentPlayer === leftPlayer ? rightPlayer : leftPlayer;
    toggleTurnBtns();
}


// 手番ボタンをトグルする関数
function toggleTurnBtns() {
    turnBtns.forEach(button => {
        button.disabled = button.disabled === true ? false : true;
        button.style.background = getComputedStyle(button).backgroundColor === "rgb(255, 0, 0)" ? "#777" : "#ff0000";
    });
};


// 秒読み中の処理を管理する関数 (インターバル実行される)
function runByoYomi() {
    // 秒読みを始める時にフラグを立てて時間を代入する
    if (currentPlayer.isByoYomi === false) {
        currentPlayer.isByoYomi = true;
        currentPlayer.timer = timerSettings.byoYomi;
    };

    decrementTimer();

    // 時間切れ処理
    if (currentPlayer.isByoYomi === true && currentPlayer.timer === 0) {
        pauseClock();
        timeUpDialog.show();
    };
}


function pauseClock() {
    clearInterval(timerInterval);
    turnBtns.forEach(button => {
        button.disabled = true;
        button.style.background = "#ccc";
    });
}


function resetClock() {
    leftPlayer.timer = 0;
    rightPlayer.timer = 0;

    // タイマーの表示をリセット
    document.getElementById("left-player-timer").textContent = "00:00";
    document.getElementById("right-player-timer").textContent = "00:00";

    // 手番ボタンをリセット
    turnBtns.forEach(button => {
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


function decrementTimer() {
    currentPlayer.timer--

    // 残り秒数読み上げ
    switch (currentPlayer.timer) {
        case 0:
            break;

        case 10:
            currentAudio = audios.byoYomi10;
            currentAudio.play();
            break;

        case 30:
            currentAudio = audios.byoYomi30;
            currentAudio.play();
            break;

        case 60:
            break;

        case 120:
            break;

        default:
            break;
    };

    updateDisplay();
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

    if (hours >= 1) {
        return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    } else {
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    };
}
