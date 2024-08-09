import { runParticleEffect, runConfettiEffect } from './effects.js';

// 要素取得
const counter = document.getElementById('counter');
const settingMenu = document.getElementById('settingsMenu');

// エフェクト設定
const particleCanvas = document.createElement('canvas');
particleCanvas.id = 'particleCanvas';
document.body.appendChild(particleCanvas);
const ctx = particleCanvas.getContext('2d');
let toggleEffect = null;

// カウンター変数
let count = 0;
let incrementStep = 1;

// 背景色
let currentHue = 0;

// 長押し設定
let longPressTimer = null;
let longPressDuration = 2000;

// インクリメント
function increment() {
    const prevCount = count;
    count += incrementStep;
    counter.innerText = count;
    currentHue = (currentHue + 2) % 360;
    setBackgroundColor(currentHue);

    saveState();
    console.log("a");
    console.log(toggleEffect);
    if (toggleEffect !== true) {
        return;
    }
    console.log(toggleEffect);

    //最上位の桁の数字が変わった場合にパーティクルを作成
    if (getTopDigit(count) !== getTopDigit(prevCount) && count >= 10) {
        runParticleEffect(ctx);
    }

    // 桁が増えた場合に紙吹雪を作成
    if (count.toString().length > prevCount.toString().length) {
        runConfettiEffect(ctx);
    }
}

function getTopDigit(num) {
    return parseInt(num.toString()[0]);
}

// 背景色の設定。パステルカラーっぽい色になる
// hue: 色相
function setBackgroundColor(hue) {
    if (hue === null) {
        hue = Math.floor(Math.random() * 361);
    }
    counter.style.backgroundColor = `hsl(${hue}, 70%, 85%)`;
}


function saveState() {
    localStorage.setItem('count', count);
    localStorage.setItem('currentHue', currentHue);
    localStorage.setItem('incrementStep', incrementStep);
    localStorage.setItem('longPressDuration', longPressDuration);
    localStorage.setItem('toggleEffect', toggleEffect);
}

function loadState() {
    const savedCount = localStorage.getItem('count') ?? '0';
    const savedHue = localStorage.getItem('currentHue');
    const savedStep = localStorage.getItem('incrementStep') ?? '1';
    const savedDuration = localStorage.getItem('longPressDuration') ?? '2000';
    const savedEffect = localStorage.getItem('toggleEffect');

    count = parseInt(savedCount, 10);
    counter.innerText = count;

    if (savedHue !== null && savedCount !== '0') {
        currentHue = parseInt(savedHue, 10);
    } else {
        // countが0の場合、新しい色を生成
        currentHue = null;
    }
    setBackgroundColor(currentHue);
    if (savedEffect !== null) {
        toggleEffect = savedEffect === 'true';
        document.getElementById('toggleEffect').checked = toggleEffect;
    }

    if (savedStep !== null) {
        incrementStep = parseInt(savedStep, 10);
        document.getElementById('incrementStep').value = incrementStep;
    }

    if (savedDuration !== null) {
        longPressDuration = parseInt(savedDuration, 10);
        // プログラム内ではミリ秒でつかうため秒単位に変換して入力フィールドに反映する
        document.getElementById('longPressDuration').value = longPressDuration / 1000;
    }
}
let isResetting = false;
// リセット
function reset() {
    if (confirm("リセットしますか？")) {
        isResetting = true; // リセット中フラグを立てる
        count = 0;
        counter.innerText = count;
        setBackgroundColor(null);
        saveState();
        settingMenu.style.display = 'none';
        setTimeout(() => isResetting = false, 100); // リセット後100ms待ってフラグを解除
    }
}

function handleLongPress(event) {
    if (event.type === 'touchstart' || event.type === 'mousedown') {
        clearTimeout(longPressTimer);
        longPressTimer = setTimeout(reset, longPressDuration);
    } else if (event.type === 'touchend' || event.type === 'mouseup' || event.type === 'touchcancel') {
        clearTimeout(longPressTimer);
    }
}

// マウスおよびタッチイベント
document.getElementById("resetButton").addEventListener('click', reset);
counter.addEventListener('mousedown', handleLongPress);
counter.addEventListener('mouseup', handleLongPress);
counter.addEventListener('mouseleave', handleLongPress);
counter.addEventListener('touchstart', handleLongPress);
counter.addEventListener('touchend', handleLongPress);
counter.addEventListener('touchcancel', handleLongPress);


// 設定メニューの表示/非表示
document.getElementById('settingsButton').addEventListener('click', (event) => {
    settingMenu.style.display = (settingMenu.style.display === 'block') ? 'none' : 'block';
});

// カウントアップ処理。メニューが開かれている場合はカウントアップせずに閉じる
counter.addEventListener('click', (event) => {
    if (isResetting) return;
    if (settingMenu.style.display === 'block' && !event.target.closest('#settingsMenu') && !event.target.closest('#settingsButton')) {
        settingMenu.style.display = 'none';
    } else {
        increment();
    }
});

document.getElementById('longPressDuration').addEventListener('change', function () {
    longPressDuration = parseFloat(this.value) * 1000; // 秒をミリ秒に変換
    saveState();
});

document.getElementById('incrementStep').addEventListener('change', function () {
    incrementStep = parseInt(this.value, 10);
    saveState();
});

document.getElementById('toggleEffect').addEventListener('change', function () {
    toggleEffect = this.checked;
    saveState();
});

window.onload = () => {
    loadState();
    // キャンバスのリサイズ
    function resizeCanvas() {
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
};

