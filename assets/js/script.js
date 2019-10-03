$(document).ready(initializeApp);

function initializeApp() {
  $(".game-area").on("click", ".card", handleCardClick);
  // $(".reset-button").click(resetGame);
  updateStats();
}

var firstClicked = null;
var secondClicked = null;
var matches = 0;
var maxMatches = 9;
var attempts = 0;
var gamesPlayed = 0;

function handleCardClick(event) {
  var targetCard = $(event.currentTarget);
  if (!firstClicked) {
    firstClicked = targetCard;
    flipCard(targetCard);
    return;
  } else {
    secondClicked = targetCard;
  }
  if (firstClicked.is(secondClicked)) {
    secondClicked = null;
    return;
  }
  flipCard(targetCard);
  attempts++;
  checkMatch(firstClicked, secondClicked);
  updateStats();
}

function checkMatch(card1, card2) {
  var firstImage = card1.find(".front").css("background-image");
  var secondImage = card2.find(".front").css("background-image");
  if (firstImage === secondImage) {
    console.log("Cards Match");
    matches++;
    hideCard(firstClicked, secondClicked);
    firstClicked = null;
    secondClicked = null;
    checkWin();
  } else {
    $(".game-area").unbind("click");
    console.log("Try Again");
    setTimeout(function () {
      flipCard(firstClicked, secondClicked);
      firstClicked = null;
      secondClicked = null;
      $(".game-area").on("click", ".card", handleCardClick);
    }, 1500);
  }
}

function checkWin() {
  if (matches === maxMatches) {
    console.log("You Win");
    setTimeout(function () { $(".gameover-modal").removeClass("hidden");}, 1000)
    gamesPlayed++
  }
}

function updateStats() {
  $("#gamesPlayed").text(gamesPlayed);
  $("#matchAttempts").text(attempts);
  var accuracy = (matches / attempts * 100).toFixed(2);
  if (accuracy === "NaN") {
    $("#accuracy").text("0.00%");
  } else {
    $("#accuracy").text(accuracy + "%");
  }
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
