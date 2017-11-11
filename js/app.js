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
    $('p').after(createStar());
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
  $('table').find('i').removeClass('green');
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
    checkForFlash.call(this);
    lastClicked = this;
  } else if (!cardShowing.call(this)) {
    continueGame.call(this);
  }
}

function checkForFlash() {
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

let firstCard = () => {
  return clickedCards[clickedCards.length-2]
};

let secondCard = () => {
  return clickedCards[clickedCards.length-1]
};

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
  if(secondCard == firstCard) {
    setupSuccess(fn1, fn2);
  } else {
    setupError(fn1, fn2);
  }
};

let setupSuccess = (fn1, fn2) => {
  flashSuccess(fn1, fn2)
  changeCardColor(fn1, 'green')
  changeCardColor(fn2, 'green')
}

let setupError = (fn1, fn2) => {
  flashError(fn1, fn2)
  changeCardColor(fn1, 'red')
  changeCardColor(fn2, 'red')
}

let changeCardColor = (fn, color) => {
  $(`#${fn}`).parent('td').addClass(color);
}

let flashSuccess = (fn1, fn2) => {
  removeFlash();
  animateCard(fn1, 'bounce')
  animateCard(fn2, 'bounce')
};

let wrong = 0
let flashError = (fn1, fn2) => {
  removeFlash(fn1, fn2);
  animateCard(fn1, 'shake')
  animateCard(fn2, 'shake')
  wrong += 1
  removeStar();
};

let removeFlash = (fn1 = null, fn2 = null) => {
  setTimeout(function() {
    if (fn1 != null) {
      $(`#${fn1}`).parent('td').removeClass('red');
      $(`#${fn2}`).parent('td').removeClass('red');
      $(`#${fn1}`).removeClass('white');
      $(`#${fn2}`).removeClass('white');
    }
  }, 1000);
};

function animateCard(fn, type) {
  $(`#${fn}`).effect(type, {times:3}, 500)
}

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
