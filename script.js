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
let playerScoreInputs;

// Returns player index of elements within player containers
function getPlayerIndex(node) {
    return parseInt(node.parentElement.dataset.playerIndex);
}

function changeName() {
    const nameLabel = this;

    // Create temporary text input for new name
    const tempTextField = document.createElement("input");
    tempTextField.setAttribute("type", "text");
    tempTextField.classList.add("player-name-input");

    // Insert it into the DOM and hide nameLabel
    nameLabel.parentElement.insertBefore(tempTextField, this);
    nameLabel.style.display = "none";
    tempTextField.focus();

    // Add capture enter key to update the name
    tempTextField.addEventListener("keyup", (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            nameLabel.textContent = tempTextField.value;
            nameLabel.style.display = "initial";
            tempTextField.parentElement.removeChild(tempTextField);
        }
    });
}

// Sets the current player when another score input was clicked
function overrideCurrentPlayer() {
    currentPlayer = getPlayerIndex(this);
}

// Highlights the current players' container and focuses its score input
function focusCurrentPlayer() {
    gameContainer.querySelector(`[data-player-index="${currentPlayer}"] > .player-score-input`).focus();

    playerScoreInputs.forEach(playerScoreInput => {
        if (getPlayerIndex(playerScoreInput) === currentPlayer) {
            playerScoreInput.classList.add("active");
        } else {
            playerScoreInput.classList.remove("active");
        }
    });
}

// Updates all score labels to the current score values
function updateScoreLabels() {
    for (let i = 0; i < playerCount; i++) {
        playerScoreLabels[i].textContent = playerScores[i];
    }
}

// Adds current round score to player score
function addToScore(scoreInputField, value) {
    playerScores[currentPlayer] += value;
    updateScoreLabels();

    // Empty player score input and clear score input field
    scoreInputField.value = "";
    if (value === 0) {
        addDonut();
    } else {
        clearDonuts();
    }
    
    // Check if current player caught up to player with higher score (if catch up rule is set to true)
    if (catchUpRule.checked && value != 0) checkForCatchUp();

    // Set currentPlayer to next player
    currentPlayer++;
    if (currentPlayer >= playerCount) currentPlayer = 0;

    // Focus next player container
    focusCurrentPlayer();
}

// Removes all donuts from current player
function clearDonuts() {
    document.querySelector(`[data-player-index="${currentPlayer}"] > .player-donuts`).textContent = "";
}

// Adds a donut to current player
function addDonut() {
    const donutCount = document.querySelector(`[data-player-index="${currentPlayer}"] > .player-donuts`);
    if (donutCount.textContent == "🍩🍩") {
        donutCount.textContent = "";
        playerScores[currentPlayer] -= 1000;
    } else {
        donutCount.textContent += "🍩";
    }
    updateScoreLabels();
    currentPlayer++;
    if (currentPlayer >= playerCount) currentPlayer = 0;
    focusCurrentPlayer();
}

// Checks if current player caught up to player with higher score
function checkForCatchUp() {
    for (let i = 0; i < playerCount; i++) {
        if (i != currentPlayer && playerScores[i] === playerScores[currentPlayer]) {
            playerScores[i] -= 350;
            updateScoreLabels();
        }
    }
}

// Hooks up all event listeners
function hookEventListeners() {
    document.querySelectorAll(".player-name").forEach(playerName => {
        playerName.addEventListener("dblclick", changeName);
    });

    playerScoreLabels = document.querySelectorAll(".player-score");
    
    playerScoreInputs = document.querySelectorAll(".player-score-input");
    playerScoreInputs.forEach(scoreInput => {
        scoreInput.addEventListener("click", overrideCurrentPlayer);
        scoreInput.addEventListener("keyup", (e) => {
            if (e.keyCode === 13) {
                const score = e.target.valueAsNumber;
                if (isNaN(e.target.valueAsNumber)) return;
                addToScore(e.target, score);
            }
        });
    });
}

function buildGameContainer(playerCount) {
    // Build html consisting of player containers and insert into game container
    let html = "";

    for (let i = 0; i < playerCount; i++) {
        playerScores.push(0);
        html += 
        `<div data-player-index=${i} class="player-container player${i}">
            <p class="player-name">Player ${i}</p>
            <p class="player-score">${playerScores[i]}</p>
            <p class="player-donuts"></p>
            <input type="number" class="player-score-input">
        </div>`
    }

    gameContainer.innerHTML = html;

    hookEventListeners();
}

// Update player count and rebuild game container
function updatePlayerCount() {
    // Reset player scores
    playerScores.length = 0;
    
    playerCount = this.value;
    playerCountText.textContent = playerCount;
    buildGameContainer(playerCount);
}

// Toggle settings container when user clicks on arrow
function toggleSettings() {
    settingsContainer.classList.toggle("show");
}

playerCountInput.addEventListener("input", updatePlayerCount);
settingsArrow.addEventListener("click", toggleSettings);
settingsLabel.addEventListener("click", toggleSettings);

buttonThreeFifty.addEventListener("click", () => {
    const playerInputField = document.querySelector(`[data-player-index="${currentPlayer}"] > .player-score-input`);
    addToScore(playerInputField, 350);
});

donutButton.addEventListener("click", () => {
    addDonut();
});

buildGameContainer(playerCount);
focusCurrentPlayer();