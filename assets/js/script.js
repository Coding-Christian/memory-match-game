$(document).ready(initializeApp);

function initializeApp() {
  $(".game-area").on("click", ".card", handleCardClick);
  $(".start-button").click(startGame);
  $(".reset-button").click(resetGame);
  $(".readability-button").click(toggleReadability);
}

var game = {
  firstClicked: null,
  secondClicked: null,
  matches: 0,
  maxMatches: 9,
  attempts: 0,
  gamesPlayed: 0,
  cardArray: [
    "Joseph",
    "Jotaro",
    "Kakyoin",
    "Avdol",
    "Polnareff",
    "Iggy",
    "Holly",
    "Dio",
    "Enyaba",
  ],
};

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
    successMatch();
  } else {
    failMatch();
  }
}

function successMatch() {
  game.matches++;
  hideCard(game.firstClicked, game.secondClicked);
  game.firstClicked = null;
  game.secondClicked = null;
  checkWin();
}

function failMatch() {
  $(".game-area").unbind("click");
  setTimeout(function() {
    flipCard(game.firstClicked, game.secondClicked);
    game.firstClicked = null;
    game.secondClicked = null;
    $(".game-area").on("click", ".card", handleCardClick);
  }, 1000);
}

function checkWin() {
  if (game.matches === game.maxMatches) {
    setTimeout(function() {
      var winSound = new Audio();
      playSound(winSound, "assets/audio/yare-yare.wav");
      $(".gameover-modal").removeClass("hidden");
    }, 1000);
    game.gamesPlayed++;
  }
}

function updateStats() {
  $("#gamesPlayed").text(game.gamesPlayed);
  $("#matchAttempts").text(game.attempts);
  var accuracy = ((game.matches / game.attempts) * 100).toFixed(2);
  if (accuracy === "NaN") {
    $("#accuracy").text("0.00%");
  } else {
    $("#accuracy").text(accuracy + "%");
  }
}

function startGame() {
  $(".start-modal").addClass("hidden");
  updateStats();
  randomizeCards();
  var wager = new Audio();
  playSound(wager, "assets/audio/wager.wav");
}

function resetGame() {
  $(".card")
    .removeClass("flipped")
    .removeClass("hidden");
  $(".gameover-modal").addClass("hidden");
  game.matches = 0;
  game.attempts = 0;
  updateStats();
  randomizeCards();
}

function randomizeCards() {
  var randOrder = game.cardArray.concat(game.cardArray);
  for (var cardIndex = randOrder.length - 1; cardIndex > 0; cardIndex--) {
    var swapIndex = Math.floor(Math.random() * cardIndex);
    [randOrder[cardIndex], randOrder[swapIndex]] = [
      randOrder[swapIndex],
      randOrder[cardIndex],
    ];
  }
  assembleDeck(randOrder);
}

function assembleDeck(deck) {
  $(".card").remove();
  for (var card in deck) {
    var newCard = $("<div>").addClass("card active-card");
    newCard.append(
      $("<div>")
        .addClass("front " + deck[card])
        .attr("title", deck[card])
    );
    newCard.append($("<div>").addClass("back"));
    $(".game-area").append(newCard);
  }
  var dealSound = new Audio();
  playSound(dealSound, "assets/audio/deal-cards.wav");
  dealCards(deck);
}

function dealCards(deck) {
  for (var card = 1; card <= deck.length; card++) {
    var row = Math.floor(card / 6.5);
    var col = (card - 6 * row) % 6.5;
    var X = (0.152 * col - 0.102) * parseFloat($(".game-area").css("width"));
    var Y = (0.33 * row + 0.025) * parseFloat($(".game-area").css("height"));
    var nthCard = $(".game-area .card:nth-child(" + (card + 1) + ")");
    nthCard.css({
      transform: "translate(" + X + "px," + Y + "px)",
      "transition-delay": 0.1 * card + "s",
    });
    updateCSS(nthCard);
  }
  setTimeout(function() {
    $(".card").css("transition-delay", "");
  }, 100 * (deck.length + 1));
}

function updateCSS(card) {
  var cardTransform = card.prop("style")["cssText"].split(" ");
  if (card.hasClass("flipped")) {
    card.css({
      transform:
        cardTransform[1] + cardTransform[2].slice(0, -1) + " rotateY(180deg)",
    });
  } else {
    card.css({
      transform: cardTransform[1] + cardTransform[2].slice(0, -1),
    });
  }
}

function whichCard(element) {
  return element.find(".front").css("background-image");
}

function flipCard() {
  for (var card in arguments) {
    var flipSound = new Audio();
    playSound(flipSound, "assets/audio/card-flip.wav");
    arguments[card].toggleClass("flipped");
    arguments[card].toggleClass("active-card");
    updateCSS(arguments[card]);
  }
}

function hideCard() {
  for (var card in arguments) {
    arguments[card].toggleClass("hidden");
  }
}

function playSound(sound, source) {
  sound.src = source;
  sound.addEventListener("canplaythrough", function() {
    sound.play();
  });
  sound.load();
}

function toggleReadability() {
  if ($("body").hasClass("easy-read")) {
    $("body").removeClass("easy-read");
    $(".readability-button")
    .css("background-image",
    "url('assets/images/readability-off.png')");
  } else {
    $("body").addClass("easy-read");
    $(".readability-button").css(
      "background-image",
      "url('assets/images/readability-on.png')");
  }
}
