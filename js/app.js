// Start game with a shuffled deck
$(function() {
  shuffleTable($("table"));
});

let clickedCards = []
$("#refresh").click(function() {
  shuffleTable($("table"));
  clickedCards.length = 0
  wrong = 0
  resetStars();
})

let shuffleTable = (table) => {
  let icons = table.find("td").children("i");
  shuffleIcons(icons);
  createTable(icons);
};

let shuffleIcons = (icons) => {
  for (let i = (icons.length - 1); i > 0; i--) { // Inspired by: https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
    let randomIndex = random(i);
    let oldIcon = icons[i];
    icons[i] = icons[randomIndex];
    icons[randomIndex] = oldIcon;
  }
};

let random = (number) => {
  return Math.floor(Math.random() * (number + 1));
};

let resetStars = () => {
  $('header').find('i:lt(3)').remove();
  setStars();
};

let setStars = () => {
  for (var i = 0; i < 3; i++) {
    $('h1').after(createStar());
  }
};

let createStar = (type = '') => {
  return `<i class="material-icons">star${type}</i> `
};

let createTable = (icons) => {
  clearTable();
  addSquaresY(4);
  addSquaresX(4);
  addIcons(icons);
  addShowCardListener();
};

let clearTable = () => {
  $('table').find('i').removeClass('white');
  $('table').find('tr, td, i').remove();
};

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

let addIcons = (icons) => {
  for(let i=0; i < icons.length; i++){
    $('table').find('td')[i].append(icons[i]);
  }
}

let addShowCardListener = () => {
  $('table').find('td').click(function(){
    if (!cardShowing.call(this)) { shouldContinue.call(this); }
  });
};

var lastClicked = null;
function shouldContinue() {
  if(this != lastClicked) {
    checkForFlashMessage.call(this);
    lastClicked = this;
  } else if (!cardShowing.call(this)) {
    continueGame.call(this);
  }
}

function checkForFlashMessage() {
  if(!$('footer').length) { continueGame.call(this); }
}

function cardShowing() {
  return $(this).find('i').hasClass('white')
}

function continueGame() {
  showCard.call(this);
  addCardToClickedCards.call(this);
  checkGuess(firstCard(), secondCard());
}

function showCard() {
  $(this).find('i').addClass('white');
}

function addCardToClickedCards() {
  clickedCards.push($(this).find('i').attr('id'));
}

let checkGuess = (fn1, fn2) => {
  if (clickedCards.length % 2 != 0) { return }
  let firstCard = $(`#${fn1}`).text()
  let secondCard = $(`#${fn2}`).text()
  secondCard == firstCard ? flashSuccess() : flashError(fn1, fn2)
};

let firstCard = () => {
  return clickedCards[clickedCards.length-2]
};

let secondCard = () => {
  return clickedCards[clickedCards.length-1]
};

let flashSuccess = () => {
  addMessage("success", "Correct!")
  removeFlashMessage();
};

let wrong = 0
let flashError = (fn1, fn2) => {
  addMessage("error", "Try again!");
  removeFlashMessage(fn1, fn2);
  wrong += 1
  removeStar();
};

let addMessage = (type, message) => {
  $('body').append(`<footer class=${type}>${message}</footer>`);
};

let removeFlashMessage = (fn1 = null, fn2 = null) => {
  setTimeout(function() {
    if (fn1 != null) {
      $(`#${fn1}`).removeClass('white');
      $(`#${fn2}`).removeClass('white');
    }
    $("footer").remove();
  }, 1000);
};

let removeStar = () => {
  switch(wrong) {
    case 4:
      swapStars(2, '_half');
      break;
    case 8:
      swapStars(2);
      break;
    case 12:
      swapStars(1, '_half');
      break;
    case 16:
      swapStars(1);
      break;
    case 20:
      swapStars(0, '_half');
      break;
    case 24:
      swapStars(0);
      break;
  }
};

let swapStars = (index, type = '_border') => {
  $('header').find('i')[index].remove();
  $("header i").eq(index).before(createStar(type));
};
