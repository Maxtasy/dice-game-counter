class Player {
    constructor(parent, index) {
        this.parent = parent;
        this.playerIndex = index;
        this.score = 0;
        this.donutCount = 0;

        this.playerContainer = document.createElement("div"),
        this.playerContainer.classList.add("player-container");

        this.nameInput = document.createElement("input");
        this.nameInput.setAttribute("type", "text");
        this.nameInput.classList.add("player-name-input");

        this.playerContainer.appendChild(this.nameInput);

        this.nameLabel = document.createElement("p");
        this.nameLabel.classList.add("player-name", "show");
        this.nameLabel.textContent = `Player ${this.playerIndex}`;

        this.playerContainer.appendChild(this.nameLabel);

        this.scoreLabel = document.createElement("p");
        this.scoreLabel.classList.add("player-score");

        this.playerContainer.appendChild(this.scoreLabel);

        this.donutLabel = document.createElement("p");
        this.donutLabel.classList.add("player-donuts");

        this.playerContainer.appendChild(this.donutLabel);

        this.scoreInput = document.createElement("input");
        this.scoreInput.setAttribute("type", "number");
        this.scoreInput.classList.add("player-score-input");
        this.scoreInput.addEventListener("keyup", (e) => {
            if (e.keyCode === 13) {
                e.preventDefault()
                const value = e.target.valueAsNumber;
                if(!isNaN(value)) {
                    this.changeScore(value);
                }
            }
        });

        this.playerContainer.appendChild(this.scoreInput);
        
        this.nameLabel.addEventListener("dblclick", () => {
            this.nameLabel.classList.remove("show");
            this.nameInput.classList.add("show");
            this.nameInput.focus()
        });
        this.nameInput.addEventListener("keyup", (e) => {
            if (e.keyCode === 13) {
                e.preventDefault();
                const newName = e.target.value;
                this.nameLabel.textContent = newName;
                this.nameLabel.classList.add("show");
                this.nameInput.classList.remove("show");
            }
        });
    }

    addDonut() {
        this.donutCount++;
        if (this.donutCount >= 3) {
            this.score -= 1000;
            this.donutCount = 0;
        }

        let donuts = "";

        for (let i = 0; i < this.donutCount; i++) {
            donuts += "🍩";
        }
        this.donutLabel.textContent = donuts;
    }

    changeScore(value) {
        if (value === 0) {
            this.addDonut();
        } else {
            this.score += value;
        }
        this.removeFocus();
        this.scoreInput.value = "";
        if (this.parent.catchUpRule.checked && value !== 0) this.parent.checkForCatchUp();
        this.parent.updateScoreLabels();
        this.parent.setNextPlayerAsCurrentPlayer();
        this.parent.focusCurrentPlayer();
    }

    updateScoreLabel() {
        this.scoreLabel.textContent = this.score;
    }

    removeFocus() {
        this.playerContainer.classList.remove("active");
    }

    addFocus() {
        this.playerContainer.classList.add("active");
        this.scoreInput.focus();
    }
}

class Game {
    constructor(playerCount = DEFAULT_PLAYER_COUNT) {
        this.settingsContainer = document.querySelector(".settings-container");
        this.settingsLabel = document. querySelector(".settings-label");
        this.playerCountInput = document.querySelector("#player-count-input");
        this.catchUpRule = document.querySelector("#catch-up-rule");
        this.settingsArrow = document. querySelector(".settings-arrow");
        this.gameContainer = document.querySelector(".game-container");
        this.buttonThreeFifty = document.querySelector(".quick-input-button.threeFifty");
        this.buttonDonut = document.querySelector(".quick-input-button.donut");

        this.players = [];
        this.playerCount = playerCount;

        this.buttonThreeFifty.addEventListener("click", () => {
            this.players[this.currentPlayerIndex].changeScore(350);
        });

        this.buttonDonut.addEventListener("click", () => {
            this.players[this.currentPlayerIndex].changeScore(0);
        });
        
        this.settingsLabel.addEventListener("click", () => {
            this.toggleSettings();
        });

        this.playerCountInput.addEventListener("input", (e) => {
            this.playerCount = e.target.valueAsNumber;
            this.newGame();
        });

        this.settingsArrow.addEventListener("click", () => {
            this.toggleSettings();
        });

        this.initializeNewGame();
    }

    initializeNewGame() {
        this.gameContainer.innerHTML = "";

        for (let i = 0; i < this.playerCount; i++) {
            const player = new Player(this, i);

            this.players.push(player);
            this.gameContainer.appendChild(player.playerContainer);
        }

        this.currentPlayerIndex = 0;
        this.currentPlayer = this.players[this.currentPlayerIndex];
        this.updateScoreLabels()
        this.focusCurrentPlayer()
    }

    checkForCatchUp() {
        for (let i = 0; i < this.players.length; i++) {
            if (i != this.currentPlayerIndex && this.players[i].score === this.currentPlayer.score) {
                this.players[i].score -= 350;
            }
        }
    }

    setNextPlayerAsCurrentPlayer() {
        this.currentPlayerIndex++;
        if (this.currentPlayerIndex >= this.players.length) {
            this.currentPlayerIndex = 0;
        }
        this.currentPlayer = this.players[this.currentPlayerIndex];
    }

    focusCurrentPlayer() {
        this.players.forEach(player => {
            player.removeFocus();
        });

        this.currentPlayer.addFocus();
    }

    updateScoreLabels() {
        this.players.forEach(player => {
            player.updateScoreLabel();
        });
    }
    
    toggleSettings() {
        this.settingsContainer.classList.toggle("show");
    }
}

const DEFAULT_PLAYER_COUNT = 3;

const game = new Game()