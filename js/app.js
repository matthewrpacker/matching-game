// Start game with a shuffled deck
$(function() {
  shuffle($("table"));
});

let clickedCards = []
$("#refresh").click(function() {
  shuffle($("table"));
  clickedCards.length = 0
})

let shuffle = (table) => {
  let icons = table.find("td").children("i");
  for (let i = (icons.length - 1); i > 0; i--) { // Inspired by: https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
    let j = generateRandomNumberWithin(i);
    let x = icons[i];
    icons[i] = icons[j];
    icons[j] = x;
  }
  createTable(icons);
};

let generateRandomNumberWithin = (number) => {
  return Math.floor(Math.random() * (number + 1));
};

let createTable = (icons) => {
  clearTable();
  addSquaresY(4);
  addSquaresX(4);
  for(let i=0; i < icons.length; i++){
    $('table').find('td')[i].append(icons[i]);
  }
  addShowCardListener();
};

let clearTable = () => {
  $('table').find('i').removeClass('white');
  $('table').find('tr, td, i').remove();
}

let addSquaresY = (height) => {
  while (height > 0){
    $('table').append('<tr></tr>');
    height--;
  }
};

let addSquaresX = (width) => {
  while (width > 0) {
    $('table').find('tr').append('<td></td>');
    width--;
  }
};

let addShowCardListener = () => {
  $('table').find('td').click(function(){
    if (!cardShowing.call(this)) shouldContinue.call(this)
  });
};

var lastClicked = null;
function shouldContinue() {
  if(this != lastClicked) {
    checkForFlashMessage.call(this);
    lastClicked = this;
  } else if (!cardShowing.call(this)) {
    continueGame.call(this)
  }
}

function checkForFlashMessage() {
  if(!$('footer').length) continueGame.call(this)
}

function cardShowing() {
  return $(this).find('i').hasClass('white')
}

function continueGame() {
  showCard.call(this)
  addCardToClickedCards.call(this)
  checkGuess(firstCard(), secondCard());
}

function showCard() {
  $(this).find('i').addClass('white');
}

function addCardToClickedCards() {
  clickedCards.push($(this).find('i').attr('id'))
}

let checkGuess = (fn1, fn2) => {
  if (clickedCards.length % 2 != 0) return
  let firstCard = $(`#${fn1}`).text()
  let secondCard = $(`#${fn2}`).text()
  secondCard == firstCard ? flashSuccess() : flashError(fn1, fn2)
}

let firstCard = () => {
  return clickedCards[clickedCards.length-2]
}

let secondCard = () => {
  return clickedCards[clickedCards.length-1]
}

let flashSuccess = () => {
  addMessage("success", "Correct!")
  removeFlashMessage();
}

let flashError = (fn1, fn2) => {
  addMessage("error", "Try again!")
  removeFlashMessage(fn1, fn2);
}

let addMessage = (type, message) => {
  $('body').append(`<footer class=${type}>${message}</footer>`);
}

let removeFlashMessage = (fn1 = null, fn2 = null) => {
  setTimeout(function() {
    if (!(fn1 === null)) {
      $(`#${fn1}`).removeClass('white');
      $(`#${fn2}`).removeClass('white');
    }
    $("footer").remove();
  }, 1000);
}
