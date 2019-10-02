$(document).ready(initializeApp)

function initializeApp() {
  $(".game-area").on("click", ".card", handleCardClick)
}

var firstClicked = null;
var secondClicked = null;
var matches = null;
var maxMatches = 1;

function handleCardClick(event) {
  var targetCard = $(event.currentTarget);
  if (!firstClicked) {
    firstClicked = targetCard;
    flipCard(targetCard)
    return;
  } else {
    secondClicked = targetCard;
  }
  if (firstClicked.is(secondClicked)) {
    secondClicked = null;
    return;
  }
  flipCard(targetCard)
  checkMatch(firstClicked, secondClicked)
}

function checkMatch(card1, card2) {
  var firstImage = card1.find(".front").css("background-image")
  var secondImage = card2.find(".front").css("background-image")
  if (firstImage === secondImage) {
    console.log("Cards Match")
    matches += 1;
    hideCard(firstClicked, secondClicked)
    firstClicked = null;
    secondClicked = null;
    checkWin()
  } else {
    $(".game-area").unbind("click")
    console.log("Try Again")
    setTimeout(function () {
      flipCard(firstClicked, secondClicked)
      firstClicked = null;
      secondClicked = null;
      $(".game-area").on("click", ".card", handleCardClick)
    }, 1500)
  }
}

function checkWin() {
  if (matches === maxMatches) {

  }
}

function flipCard() {
  for (var card in arguments) {
    arguments[card].toggleClass("flipped")
  }
}

function hideCard() {
  for (var card in arguments) {
    arguments[card].toggleClass("hidden")
  }
}
