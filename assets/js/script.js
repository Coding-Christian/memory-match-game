$(document).ready(initializeApp)

function initializeApp() {
  $(".game-area").on("click", ".card", handleCardClick)
}

function handleCardClick(event) {
  var targetCard = $(event.currentTarget);
  targetCard.toggleClass("flipped")
}
