$(document).ready(initializeApp);

function initializeApp() {
  $(".game-area").on("click", ".card", handleCardClick);
  $(".reset-button").click(resetGame);
  updateStats();
  randomizeCards();
}

var game = {
  "firstClicked": null,
  "secondClicked": null,
  "matches": 0,
  "maxMatches": 9,
  "attempts": 0,
  "gamesPlayed": 0,
  "cardArray": ["joseph", "jotaro", "kakyoin", "avdol", "polnareff", "iggy", "holly", "dio", "enyaba"],
}

function handleCardClick(event) {
  var targetCard = $(event.currentTarget);
  if (!game.firstClicked) {
    game.firstClicked = targetCard;
    flipCard(targetCard);
    return;
  } else {
    game.secondClicked = targetCard;
  }
  if (game.firstClicked.is(game.secondClicked)) {
    game.secondClicked = null;
    return;
  }
  flipCard(targetCard);
  game.attempts++;
  checkMatch(game.firstClicked, game.secondClicked);
  updateStats();
}

function checkMatch(card1, card2) {
  var firstImage = whichCard(card1);
  var secondImage = whichCard(card2);
  if (firstImage === secondImage) {
    successMatch()
  } else {
    failMatch()
  }
}

function successMatch() {
  console.log("Cards Match");
  game.matches++;
  hideCard(game.firstClicked, game.secondClicked);
  game.firstClicked = null;
  game.secondClicked = null;
  checkWin();
}

function failMatch() {
  $(".game-area").unbind("click");
  console.log("Try Again");
  setTimeout(function () {
    flipCard(game.firstClicked, game.secondClicked);
    game.firstClicked = null;
    game.secondClicked = null;
    $(".game-area").on("click", ".card", handleCardClick);
  }, 1000);
}

function checkWin() {
  if (game.matches === game.maxMatches) {
    console.log("You Win");
    setTimeout(function () {
      $(".gameover-modal").removeClass("hidden");
    }, 1000);
    game.gamesPlayed++;
  }
}

function updateStats() {
  $("#gamesPlayed").text(game.gamesPlayed);
  $("#matchAttempts").text(game.attempts);
  var accuracy = (game.matches / game.attempts * 100).toFixed(2);
  if (accuracy === "NaN") {
    $("#accuracy").text("0.00%");
  } else {
    $("#accuracy").text(accuracy + "%");
  }
}

function resetGame() {
  $(".card").removeClass("flipped").removeClass("hidden");
  $(".gameover-modal").addClass("hidden");
  game.matches = 0;
  game.attempts = 0;
  updateStats();
  randomizeCards();
}

function randomizeCards() {
  var randOrder = game.cardArray.concat(game.cardArray);
  for (var cardIndex = randOrder.length - 1; cardIndex > 0; cardIndex--) {
    var swapIndex = Math.floor(Math.random() * (cardIndex));
    [randOrder[cardIndex], randOrder[swapIndex]] = [randOrder[swapIndex], randOrder[cardIndex]];
  }
  dealCards(randOrder);
}

function dealCards(deck) {
  $(".card").remove();
  for (var card in deck) {
    var newCard = $("<div>").addClass("card");
    newCard.append($("<div>").addClass("front " + deck[card]));
    newCard.append($("<div>").addClass("back"));
    $(".game-area").append(newCard);
  }
}

function whichCard(element) {
  return element.find(".front").css("background-image");
}

function flipCard() {
  for (var card in arguments) {
    arguments[card].toggleClass("flipped");
  }
}

function hideCard() {
  for (var card in arguments) {
    arguments[card].toggleClass("hidden");
  }
}
