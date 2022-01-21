let gameStarted = false,
  gameOver = false,
  playerWon = false,
  gameEven = false,
  dealersHand = [],
  playersHand = [],
  dealersPoint = 0,
  playersPoint = 0,
  dealerCardHidden = true,
  deck = [];
symbols = ["♠", "♥", "♦", "♣"];
// symbols = ["Spades", "Hearts", "Diamonds", "Clubs"];
cardValues = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
// let new-game-button = document.getElementById("new-game-button");
// let hit-button = document.getElementById("hit-button");
// let stay-button = document.getElementById("stay-button");

// hit-button.style.display = "none";
$("#hit-button").hide();
// stay-button.style.display = "none";
$("#stay-button").hide();



function startNewGame() {
  gameStarted = true;
  gameOver = false;
  playerWon = false;
  gameEven = false;
  dealerCardHidden = true;
  
  (dealersHand = []), (playersHand = []), newDeck();
  shuffle(deck);
  dealHands();
  $("#game-result").html("");
  //   new-game-button.style.display = "none";
  $("#new-game-button").hide();
  $("#restartGame").hide();
  //   hit-button.style.display = "inline";
  $("#hit-button").show();

  //   stay-button.style.display = "inline";
  $("#stay-button").show();
  showStatus();
}

$("#new-game-button").click(function () {
  startNewGame();
});

$("#restartGame").click(function () {
  startNewGame();
  
});

function newDeck() {
  for (let a = 0; a < cardValues.length; a++) {
    for (let b = 0; b < symbols.length; b++) {
      let point = parseInt(cardValues[a]);
      if (
        cardValues[a] === "J" ||
        cardValues[a] === "Q" ||
        cardValues[a] === "K"
      ) {
        point = 10;
      }
      if (cardValues[a] == "A") {
        point = 11;
      }
      let card = { Value: cardValues[a], Symbols: symbols[b], Point: point };
      deck.push(card);
    }
  }
}

function shuffle(deck) {
  let currentIndex = deck.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [deck[currentIndex], deck[randomIndex]] = [
      deck[randomIndex],
      deck[currentIndex],
    ];
  }
  return deck;
} // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array

$("#hit-button").click(function () {
    //dealerCardHidden = false;
  playersHand.push(getNextCard());
  checkEnd();
  showStatus();
});

$("#stay-button").click(function () {
    dealerCardHidden = false;
  gameOver = true;
  checkEnd();
  showStatus();
});

function dealHands() {
  for (let i = 0; i < 2; i++) {
    let card = deck.shift();
    playersHand.push(card);
  }
  for (let x = 0; x < 2; x++) {
    let card = deck.shift();
    dealersHand.push(card);
  }
}

function checkEnd() {
  updateScores();

  if (gameOver) {
    while (
    //   dealersPoint < playersPoint &&
      playersPoint <= 21 &&
      dealersPoint < 17
    ) {
      dealersHand.push(getNextCard());
      updateScores();
    }
  }

  if (playersPoint > 21) {
    playerWon = false;
    gameOver = true;
  } else if (dealersPoint > 21) {
    playerWon = true;
    gameOver = true;
  } else if (gameOver) {
    if (playersPoint > dealersPoint) {
      playerWon = true;
    } else if (playersPoint < dealersPoint) {
      playerWon = false;
    } else {
      gameEven = true;
    }
  }
}

function getCardString(card) {
  return card.Value + " of " + card.Symbols;
}

function getCardHTML(card) {
  const html = `<div class="card">${card.Value}${card.Symbols}</div>`;
  return html;
}

function showStatus() {
  //https://embed.plnkr.co/plunk/qjVrV3//
  let dealerCardsHTML = "";
  for (let i = 0; i < dealersHand.length; i++) {
    dealerCardsHTML += getCardHTML(dealersHand[i]);
  }

  let playerCardsHTML = "";
  for (let i = 0; i < playersHand.length; i++) {
    playerCardsHTML += getCardHTML(playersHand[i]);
  }

  updateScores();

  $("#dealer-text").html("Dealer has:");
  $("#dealer-deck").html(dealerCardsHTML);
  $("#dealer-point").html(dealersPoint);

  if(dealerCardHidden){
      // hide the card 
      $("#dealer-deck .card:last-child").html("")
  }

  $("#player-text").html("Player has:");
  $("#player-deck").html(playerCardsHTML);
  $("#player-point").html(playersPoint);

  //   gameArea.innerHTML =
  //     "Dealer has:\n" +
  //     dealerCardsHTML +
  //     "(score: " +
  //     dealersPoint +
  //     ")\n\n" +
  //     "Player has:\n" +
  //     playerCardString +
  //     "(score: " +
  //     playersPoint +
  //     ")\n\n";

  if (gameOver) {
    if (playerWon) {
      $("#game-result").html("YOU WIN!");
    } else if (gameEven) {
      $("#game-result").html("TIE!");
    } else {
      $("#game-result").html("DEALER WINS!");
    }

    // new-game-button.style.display = "inline";
    $("#restartGame").show();
    $("#hit-button").hide();
    $("#stay-button").hide();
    // hit-button.style.display = "none";
    // stay-button.style.display = "none";
  }
}

function getScore(cardArray) {
  let score = 0;
  let aces = 0;
  for (let i = 0; i < cardArray.length; i++) {
    let card = cardArray[i];
    score += card.Point;
    if (card.Value === "A") {
      aces++;
    }

    if (score > 21 && aces > 0) {
      score -= 10;
      aces--;
    }
  }
  return score;
}

function updateScores() {
    if(dealerCardHidden){
        // it is hidden initially
        let lastCardExcluded = [...dealersHand]; // copy the array
        lastCardExcluded.pop()
        dealersPoint = getScore(lastCardExcluded);
    }else{
        // it is visible
        dealersPoint = getScore(dealersHand);
    }
  playersPoint = getScore(playersHand);
}

function getNextCard() {
  return deck.shift();
}
