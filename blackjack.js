let dealerSum = 0;
let yourSum = 0;
let dealerAceCount = 0;
let yourAceCount = 0;
let hidden;
let deck;
let canHit = true;
let betAmount = 0;
let balance = 1000; // saldo inicial

window.onload = function() {
    buildDeck();
    shuffleDeck();
    startGame();
    document.getElementById("place-bet").addEventListener("click", placeBet);
    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);
    document.getElementById("restart").addEventListener("click", restartGame);
}

function placeBet() {
    if (!canHit) return;

    betAmount = parseInt(document.getElementById("bet").value);

    if (betAmount <= 0 || betAmount > balance) {
        alert("Invalid bet amount!");
        return;
    }

    document.getElementById("bet").disabled = true;
    document.getElementById("place-bet").disabled = true;
}

function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];
    deck = [];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]);
        }
    }
}

function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length);
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
}

function startGame() {
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);
    document.getElementById("dealer-sum").innerText = dealerSum; // Mostrar la suma inicial del dealer

    while (dealerSum < 17) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
        document.getElementById("dealer-sum").innerText = dealerSum; // Actualizar la suma del dealer en cada carta
    }

    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById("your-cards").append(cardImg);
    }

    document.getElementById("your-sum").innerText = yourSum; // Mostrar la suma inicial del jugador
}

function hit() {
    if (!canHit) {
        return;
    }

    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);
    document.getElementById("your-sum").innerText = yourSum; // Actualizar la suma del jugador después de cada carta

    if (reduceAce(yourSum, yourAceCount) > 21) {
        canHit = false;
        endGame();
    }
}

function stay() {
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);

    canHit = false;
    document.getElementById("hidden").src = "./cards/" + hidden + ".png";

    let message = "";
    if (yourSum > 21) {
        message = "You Lose!";
        balance -= betAmount;
    }
    else if (dealerSum > 21 || yourSum > dealerSum) {
        message = "You Win!";
        balance += betAmount;
    }
    else if (yourSum == dealerSum) {
        message = "Tie!";
    }
    else {
        message = "You Lose!";
        balance -= betAmount;
    }

    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("your-sum").innerText = yourSum;
    document.getElementById("results").innerText = message;
    updateBalance();
}

function restartGame() {
    // Limpiar el estado del juego
    dealerSum = 0;
    yourSum = 0;
    dealerAceCount = 0;
    yourAceCount = 0;
    hidden = null;
    deck = [];
    canHit = true;
    betAmount = 0;

    // Habilitar el formulario de apuesta nuevamente
    document.getElementById("bet").disabled = false;
    document.getElementById("place-bet").disabled = false;
    document.getElementById("bet").value = "";

    // Limpiar cartas visibles
    document.getElementById("dealer-cards").innerHTML = '<img id="hidden" src="./cards/BACK.png">';
    document.getElementById("your-cards").innerHTML = '';

    // Limpiar resultados y sumas mostradas
    document.getElementById("dealer-sum").innerText = "";
    document.getElementById("your-sum").innerText = "";
    document.getElementById("results").innerText = "";

    // Barajar el mazo y comenzar un nuevo juego
    buildDeck();
    shuffleDeck();
    startGame();

    // Actualizar el balance
    updateBalance();
    
    // Controlar el balance
    if (balance <= 0) {
        document.getElementById("results").innerText = "No tienes más dinero para apostar.";
        document.getElementById("bet").disabled = true;
        document.getElementById("place-bet").disabled = true;
    }
}

function updateBalance() {
    document.getElementById("results").innerText = `Balance: $${balance}`;
}

function getValue(card) {
    let data = card.split("-");
    let value = data[0];

    if (isNaN(value)) {
        if (value == "A") {
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}

function checkAce(card) {
    if (card[0] == "A") {
        return 1;
    }
    return 0;
}

function reduceAce(playerSum, playerAceCount) {
    while (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount -= 1;
    }
    return playerSum;
}

function endGame() {
    document.getElementById("results").innerText = "You Lose! You exceeded 21.";
    updateBalance();
}
