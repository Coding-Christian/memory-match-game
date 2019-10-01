$(document).ready(initializeApp)

function initializeApp() {
  $(".game-area").on("click", ".card", handleCardClick)
}

var firstClicked = null;
var secondClicked = null;
var matches = null;

function handleCardClick(event) {
  var targetCard = $(event.currentTarget);
  flipCard(targetCard)
  if (!firstClicked) {
    firstClicked = targetCard;
    return;
  } else {
    secondClicked = targetCard;
  }
  var firstImage = firstClicked.find(".front").css("background-image")
  var secondImage = secondClicked.find(".front").css("background-image")
  if (firstImage === secondImage) {
    console.log("Cards Match")
    matches += 1;
    hideCard(firstClicked, secondClicked)
    firstClicked = null;
    secondClicked = null;
  } else {
    $(".game-area").unbind("click")
    console.log("Try Again")
    setTimeout(function(){
      flipCard(firstClicked, secondClicked)
      firstClicked = null;
      secondClicked = null;
      $(".game-area").on("click", ".card", handleCardClick)
    }, 1500)
  }
}

function flipCard() {
  for (var card in arguments) {
    arguments[card].toggleClass("flipped")
  }
}

function hideCard() {
  for (var card in arguments) {
    arguments[card].css("visibility", "hidden")
  }
}
