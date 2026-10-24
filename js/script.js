// Get the HTML elements that JavaScript needs.
const diceCount = document.getElementById("diceCount");
const diceDisplay = document.getElementById("diceDisplay");
const diceResult = document.getElementById("diceResult");
const rollHistory = document.getElementById("rollHistory");
const emptyHistory = document.getElementById("emptyHistory");

// The dice face is a 3 x 3 grid. These are its dot positions:
// 1 2 3
// 4 5 6
// 7 8 9
const dotPositions = {
    1: [5],
    2: [1, 9],
    3: [1, 5, 9],
    4: [1, 3, 7, 9],
    5: [1, 3, 5, 7, 9],
    6: [1, 3, 4, 6, 7, 9]
};

let history = [];

// Return one random whole number from 1 to 6.
function rollDie() {
    return Math.floor(Math.random() * 6) + 1;
}

// Draw the dice faces using HTML elements.
function showDice(numbers) {
    diceDisplay.innerHTML = ""; // Clear the previous dice.

    for (const number of numbers) {
        const die = document.createElement("div");
        die.className = "die";
        die.setAttribute("role", "img");
        die.setAttribute("aria-label", "Die showing " + number);

        for (const position of dotPositions[number]) {
            const dot = document.createElement("span");
            dot.className = "dot";
            dot.style.gridRow = Math.ceil(position / 3);
            dot.style.gridColumn = ((position - 1) % 3) + 1;
            die.appendChild(dot);
        }

        diceDisplay.appendChild(die);
    }
}

// Show the history, or show the plain "No rolls yet!" message.
function updateHistory() {
    rollHistory.innerHTML = "";

    if (history.length === 0) {
        emptyHistory.hidden = false;
        rollHistory.hidden = true;
        return;
    }

    emptyHistory.hidden = true;
    rollHistory.hidden = false;

    for (const entry of history) {
        const item = document.createElement("li");
        item.textContent = entry;
        rollHistory.appendChild(item);
    }
}

// Roll one or two dice and save the result.
function rollDice() {
    const count = Number(diceCount.value);
    const numbers = [];
    let total = 0;

    for (let i = 0; i < count; i++) {
        const number = rollDie();
        numbers.push(number);
        total += number;
    }

    showDice(numbers);

    let message;
    if (count === 1) {
        message = "You rolled " + numbers[0] + "!";
    } else {
        message = "You rolled " + numbers.join(" + ") + " = " + total + "!";
    }
    diceResult.textContent = message;

    // After 10 history entries, the NEXT roll starts a new batch.
    if (history.length === 10) {
        history = [];
    }
    history.push(message);
    updateHistory();
}

// Changing the dropdown immediately changes the number of displayed dice.
diceCount.addEventListener("change", function () {
    const count = Number(diceCount.value);
    showDice(Array(count).fill(1)); // Show example faces until the next roll.
    diceResult.textContent = "Click Roll Dice to start!";
});

document.getElementById("rollButton").addEventListener("click", rollDice);

// Clear History empties the history; it does not change the dice result.
document.getElementById("clearHistoryButton").addEventListener("click", function () {
    history = [];
    updateHistory();
});

// Initial view: one example die and an empty history.
showDice([1]);
updateHistory();

