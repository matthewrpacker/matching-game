$(function() {
  shuffleTable($('table'));
  startTimer();
  checkRefresh();
});

const shuffleTable = (table) => {
  let icons = table.find('td').children('i');
  shuffleIcons(icons);
  createTable(icons);
};

const shuffleIcons = (icons) => {
  for (let i = (icons.length - 1); i > 0; i--) { // Inspired by: https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
    let randomIndex = random(i);
    let oldIcon = icons[i];
    icons[i] = icons[randomIndex];
    icons[randomIndex] = oldIcon;
  }
};

const random = (number) => {
  return Math.floor(Math.random() * (number + 1));
};

const createTable = (icons) => {
  clearTable();
  addSquaresY(4);
  addSquaresX(4);
  addIcons(icons);
  addShowCardListener();
};

const clearTable = () => {
  $('table').find('i').removeClass('white');
  $('table').find('i').removeClass('green');
  $('table').find('tr, td, i').remove();
};

const addSquaresY = (height) => {
  while (height > 0){
    $('table').append('<tr></tr>');
    height--;
  }
};

const addSquaresX = (width) => {
  while (width > 0) {
    $('table').find('tr').append('<td></td>');
    width--;
  }
};

const addIcons = (icons) => {
  for(let i=0; i < icons.length; i++){
    $('table').find('td')[i].append(icons[i]);
  }
}

const addShowCardListener = () => {
  $('table').find('td').click(function(){
    if (!cardShowing.call(this)) { shouldContinue.call(this); }
  });
};

const startTimer = () => {
  setInterval(function() {
    setTime();
  }, 1000);
}

let startTime = new Date().getTime();
function setTime() { // Inspired by: https://www.w3schools.com/howto/howto_js_countdown.asp
  let currentTime = new Date().getTime();
  let passedTime = currentTime - startTime;
  let seconds = Math.floor((passedTime % (1000 * 60)) / 1000);
  let minutes = Math.floor((passedTime % (1000 * 60 * 60)) / (1000 * 60));
  if(seconds <= 9) { seconds = `0${seconds}` }
  return $('#timer').html(`${minutes}:${seconds}`)
}

function checkRefresh() {
  $('#refresh').click(function() {
    resetTable();
  })
}

let clickedCards = []
let correctCards = 0
const resetTable = () => {
  startTime = new Date().getTime();
  startTimer();
  shuffleTable($('table'));
  clickedCards.length = 0
  correctCards = 0
  wrong = 0
  resetStars();
  updateMoves();
}

const resetStars = () => {
  $('header').find('i:lt(3)').remove();
  setStars();
};

const setStars = () => {
  for (let i = 0; i < 3; i++) {
    $('#moves').after(createStar());
  }
};

const createStar = (type = '') => {
  return `<i class="material-icons">star${type}</i> `
};

const updateMoves = () => {
  return $('#moves').html(`${clickedCards.length/2} Moves`)
}

let lastClicked = null;
function shouldContinue() {
  if(this != lastClicked) {
    lastClicked = this;
  }
  continueGame.call(this);
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
  if((clickedCards.length % 2) === 0) { updateMoves(); }
}

let firstCard = () => {
  return clickedCards[clickedCards.length-2]
};

let secondCard = () => {
  return clickedCards[clickedCards.length-1]
};

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
  correctCards += 1
  if(correctCards === 8) {
    addWinTime()
    $('#timer').remove();
    $('#refresh').hide();
    $('table').hide();
    $('header').append('<h2>You Won!</h2>');
    $('header').append('<div><i id="check-mark" class="material-icons md-180">check</i></div>')
    $('header').append('<button id="play">Play Again</button>');
    checkButtonClick();
  }
}

let flashSuccess = (fn1, fn2) => {
  removeFlash();
  animateCard(fn1, 'bounce')
  animateCard(fn2, 'bounce')
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

let animateCard = (fn, type) => {
  $(`#${fn}`).effect(type, {times:3}, 500)
}

let changeCardColor = (fn, color) => {
  $(`#${fn}`).parent('td').addClass(color);
}

function addWinTime() {
  let time =  $('#timer').html()
  $('header').find('h1').after(`<p id="win-timer">${time}</p>`);
}

function checkButtonClick() {
  $('#play').click(function() {
    $('#win-timer').remove()
    $('h2').remove()
    $('#check-mark').remove()
    $('#play').remove()
    $('#refresh').show();
    $('table').show();
    $('header').find('h1').after('<p id="timer">0:00</p>');
    resetTable();
  })
}

let setupError = (fn1, fn2) => {
  flashError(fn1, fn2)
  changeCardColor(fn1, 'red')
  changeCardColor(fn2, 'red')
}

let wrong = 0
let flashError = (fn1, fn2) => {
  removeFlash(fn1, fn2);
  animateCard(fn1, 'shake')
  animateCard(fn2, 'shake')
  wrong += 1
  removeStar();
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
  $('header i').eq(index).before(createStar(type));
};
