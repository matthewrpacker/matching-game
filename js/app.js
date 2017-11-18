$(() => {
  shuffleTable($('table'));
  checkRefresh();
});

const shuffleTable = (table) => {
  let icons = table.find('td').children('i');
  shuffleIcons(icons);
  createTable(icons);
};

const shuffleIcons = (icons) => {
  for(let i = (icons.length - 1); i > 0; i--) { // Inspired by: https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
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
  $('table').find('tr, td').remove();
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
  for(let i = 0; i < icons.length; i++) {
    $('table').find('td')[i].append(icons[i]);
  }
};

let clickedCards = []
const addShowCardListener = () => {
  $('table').find('td').click(function() {
    if(clickedCards.length === 0) { startGame(); } // start timer on first card
    if (!cardShowing.call(this)) { shouldContinue.call(this); } // prevent guessing the same card twice in row
  });
};

let startTime;
const startGame = () => {
  startTime = new Date().getTime();
  startTimer();
  $('header').find('p:first').attr('id', 'timer'); // reset timer ID after refresh & win game
}

const startTimer = () => {
  setInterval(() => { setTime(); });
}

const setTime = () => { // Inspired by: https://www.w3schools.com/howto/howto_js_countdown.asp
  let currentTime = new Date().getTime();
  let passedTime = currentTime - startTime;
  let seconds = Math.floor((passedTime % (1000 * 60)) / 1000);
  let minutes = Math.floor((passedTime % (1000 * 60 * 60)) / (1000 * 60));
  if(seconds <= 9) { seconds = `0${seconds}` }
  return $('#timer').html(`${minutes}:${seconds}`)
}

function cardShowing() {
  return $(this).find('i').hasClass('white');
}

let lastClicked = null;
function shouldContinue() {
  if(this != lastClicked) { lastClicked = this; } // track current card
  continueGame.call(this);
}

function continueGame() {
  showCard.call(this);
  addCardToClickedCards.call(this);
  checkGuess(card1(), card2());
}

function showCard() {
  $(this).find('i').addClass('white');
}

function addCardToClickedCards() {
  clickedCards.push($(this).find('i').attr('id'));
  if((clickedCards.length % 2) === 0) { updateMoves(); } // add one move every two cards
}

const updateMoves = () => {
  return $('.moves:first').html(`${clickedCards.length/2}`)
}

const card1 = () => {
  return clickedCards[clickedCards.length-2]
};

const card2 = () => {
  return clickedCards[clickedCards.length-1]
};

const checkGuess = (card1ID, card2ID) => {
  if (clickedCards.length % 2 != 0) { return } // guess is not complete
  let card1 = $(`#${card1ID}`).text()
  let card2 = $(`#${card2ID}`).text()
  card2 === card1 ? success(card1ID, card2ID) : error(card1ID, card2ID)
};

let correctCards = 0
const success = (card1ID, card2ID) => {
  animateCard([card1ID, card2ID], 'bounce')
  changeCardColor([card1ID, card2ID], 'green')
  correctCards += 1
  checkForWin();
}

const animateCard = (IDs, type) => {
  IDs.forEach((ID) => {
    $(`#${ID}`).effect(type, {distance:10}, {times:2}, 500);
  });
}

const changeCardColor = (IDs, color) => {
  IDs.forEach((ID) => { $(`#${ID}`).parent('td').addClass(color); });
}

const checkForWin = () => {
  if(correctCards === 8) {
    addWinTime();
    hideGame();
    showWinView();
    shouldPlayAgain();
  }
}

const addWinTime = () => {
  let time =  $('#timer').html()
  $('header').find('h1').after(`<p id="win-timer">${time}</p>`);
}

const hideGame = () => {
  $('#timer').remove();
  $('#refresh').hide();
  $('table').hide();
}

const showWinView = () => {
  $('header').append('<h2>You Won!</h2>');
  $('header').append('<div><i id="check-mark" class="material-icons lg">check</i></div>');
  $('header').append('<button id="play">Play Again</button>');
}

const shouldPlayAgain = () => {
  $('#play').click(() => {
    hideWinView();
    showGame();
    resetTable();
  })
}

const hideWinView = () => {
  ['#win-timer', 'h2', '#check-mark', '#play'].forEach((f) => {
    $(f).remove();
  })
}

const showGame = () => {
  $('#refresh').show();
  $('table').show();
  $('header').find('h1').after('<p id="timer">0:00</p>');
}

let wrong = 0
const resetTable = () => {
  clickedCards.length = 0
  shuffleTable($('table'));
  if($('#temporary-time').length == 0) { addTemporaryTimer(); }
  correctCards = 0
  wrong = 0
  resetStars();
  updateMoves();
  addNewMoveClass();
}

const addTemporaryTimer = () => {
  $('#timer').remove()
  $('header').find('h1').after('<p id="temporary-time">0:00</p>');
}

const resetStars = () => {
  $('header').find('i:lt(3)').remove();
  setStars();
};

const setStars = () => {
  for (let i = 0; i < 3; i++) {
    $('.moves:last').after(createStar());
  }
};

const createStar = (type = '') => {
  return `<i class="material-icons">star${type}</i> `
};

const error = (card1ID, card2ID) => {
  flashError(card1ID, card2ID)
  changeCardColor([card1ID, card2ID], 'red')
}

const flashError = (card1ID, card2ID) => {
  let cardIDs = [card1ID, card2ID]
  removeFlash(cardIDs);
  animateCard(cardIDs, 'shake')
  wrong += 1
  removeStar();
};

const removeFlash = (cardIDs) => {
  setTimeout(() => {
    if (cardIDs[0] != null) { cardIDs.forEach((ID) => { resetCard(ID); }) }
  }, 1000);
};

const resetCard = (ID) => {
  $(`#${ID}`).parent('td').removeClass('red');
  $(`#${ID}`).removeClass('white');
}

const removeStar = () => {
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
  }
};

const swapStars = (index, type = '_border') => {
  $('header').find('i')[index].remove();
  $('header i').eq(index).before(createStar(type));
};

const addNewMoveClass = () => {
  return $('.moves:last').addClass('new-move')
}

const checkRefresh = () => {
  $('#refresh').click(() => {
    if(guessIsDone()) {
      resetTable();
    }
  })
}

const guessIsDone = () => {
  return ($('.red').length === 0)
}
