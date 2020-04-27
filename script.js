const playerCountText = document.querySelector(".player-count");
const playerCountInput = document.querySelector("#player-count-input");
const gameContainer = document.querySelector(".game-container");
const settingsArrow = document. querySelector(".settings-arrow");
const settingsLabel = document. querySelector(".settings-label");
const settingsContainer = document.querySelector(".settings-container");
const catchUpRule = document.querySelector("#catch-up-rule");
const donutButton = document.querySelector(".quick-input-button.donut");
const buttonThreeFifty = document.querySelector(".quick-input-button.threeFifty");

const DEFAULT_PLAYER_COUNT = 3;

let currentPlayer = 0;
let playerCount = DEFAULT_PLAYER_COUNT;
let playerScores = [];
let playerScoreLabels;

function changeName() {
    const newName = prompt("Enter new Name: ")
    if (newName) {
        this.textContent = newName;
    }
}

function overrideCurrentPlayer() {
    currentPlayer = parseInt(this.classList[1].charAt(this.classList[1].length-1));
}

function focusCurrentPlayer() {
    gameContainer.querySelector(`.player-score-input.player${currentPlayer}`).focus();

    for (let i = 0; i < playerCount; i++) {
        if (i === currentPlayer) {
            document.querySelector(`.player-container.player${i}`).classList.add("active");
        } else {
            document.querySelector(`.player-container.player${i}`).classList.remove("active");
        }
    }
}

function addToScore(value) {
    playerScores[currentPlayer] += value;
    updateScores();
    document.querySelector(`.player-score-input.player${currentPlayer}`).value = "";
    document.querySelector(`.player-donuts.player${currentPlayer}`).textContent = "";
    if (catchUpRule.checked) checkForCatchUp();
    currentPlayer++;
    if (currentPlayer >= playerCount) currentPlayer = 0;
    focusCurrentPlayer();
}

function addDonut() {
    const donutCount = document.querySelector(`.player-donuts.player${currentPlayer}`);
    if (donutCount.textContent == "🍩🍩") {
        donutCount.textContent = "";
        playerScores[currentPlayer] -= 1000;
    } else {
        donutCount.textContent += "🍩";
    }
    updateScores();
    currentPlayer++;
    if (currentPlayer >= playerCount) currentPlayer = 0;
    focusCurrentPlayer();
}

function updateScores() {
    for (let i = 0; i < playerCount; i++) {
        playerScoreLabels[i].textContent = playerScores[i];
    }
}

function checkForCatchUp() {
    console.log("checking")
    for (let i = 0; i < playerCount; i++) {
        if (i != currentPlayer && playerScores[i] === playerScores[currentPlayer]) {
            playerScores[i] -= 350;
            updateScores();
        }
    }
}

function hookEventListeners() {
    document.querySelectorAll(".player-name").forEach(playerName => {
        playerName.addEventListener("dblclick", changeName);
    });

    playerScoreLabels = document.querySelectorAll(".player-score");
    
    document.querySelectorAll(".player-score-input").forEach(scoreInput => {
        scoreInput.addEventListener("click", overrideCurrentPlayer);
        scoreInput.addEventListener("keyup", (e) => {
            if (e.keyCode === 13) {
                const score = e.target.valueAsNumber;
                if (isNaN(e.target.valueAsNumber)) return;
                addToScore(score);
            }
        });
    });
}

function buildGameContainer(playerCount) {
    let html = "";

    for (let i = 0; i < playerCount; i++) {
        playerScores.push(0);
        html += 
        `<div class="player-container player${i}">
            <p class="player-name player${i}">Player ${i}</p>
            <p class="player-score player${i}">${playerScores[i]}</p>
            <p class="player-donuts player${i}"></p>
            <input type="number" class="player-score-input player${i}">
        </div>`
    }

    gameContainer.innerHTML = html;

    hookEventListeners();
}

function updatePlayerCount() {
    playerCountText.textContent = this.value;
    playerCount = this.value;
    buildGameContainer(this.value);
}

function toggleSettings() {
    settingsContainer.classList.toggle("show");
}

playerCountInput.addEventListener("input", updatePlayerCount);
settingsArrow.addEventListener("click", toggleSettings);
settingsLabel.addEventListener("click", toggleSettings);

buttonThreeFifty.addEventListener("click", () => {
    addToScore(350);
});

donutButton.addEventListener("click", () => {
    addDonut();
});

buildGameContainer(playerCount);
focusCurrentPlayer();