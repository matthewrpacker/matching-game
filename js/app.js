$(() => {
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
  for(let i = 0; i < icons.length; i++) {
    $('table').find('td')[i].append(icons[i]);
  }
};

const addShowCardListener = () => {
  $('table').find('td').click(function() {
    if (!cardShowing.call(this)) { shouldContinue.call(this); }
  });
};

function cardShowing() {
  return $(this).find('i').hasClass('white');
}

let lastClicked = null;
function shouldContinue() {
  if(this != lastClicked) { lastClicked = this; }
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

let clickedCards = []
function addCardToClickedCards() {
  clickedCards.push($(this).find('i').attr('id'));
  if((clickedCards.length % 2) === 0) { updateMoves(); }
}

const updateMoves = () => {
  return $('#moves').html(`${clickedCards.length/2} Moves`)
}

const card1 = () => {
  return clickedCards[clickedCards.length-2]
};

const card2 = () => {
  return clickedCards[clickedCards.length-1]
};

const checkGuess = (card1ID, card2ID) => {
  if (clickedCards.length % 2 != 0) { return }
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

const checkForWin = () => {
  if(correctCards === 8) {
    addWinTime();
    hideGame();
    showWinView();
    shouldPlayAgain();
  }
}

const hideGame = () => {
  $('#timer').remove();
  $('#refresh').hide();
  $('table').hide();
}

const showWinView = () => {
  $('header').append('<h2>You Won!</h2>');
  $('header').append('<div><i id="check-mark" class="material-icons md-180">check</i></div>');
  $('header').append('<button id="play">Play Again</button>');
}

const removeFlash = (cardIDs) => {
  setTimeout(() => {
    if (cardIDs[0] != null) { cardIDs.forEach((ID) => { resetCard(ID); }) }
  }, 1000);
};

const resetCard = (ID) => {
  $(`#${ID}`).parent('td').removeClass('red');
  $(`#${ID}`).removeClass('white');
}

const animateCard = (IDs, type) => {
  IDs.forEach((ID) => { $(`#${ID}`).effect(type, {times:2}, 500); });
}

const changeCardColor = (IDs, color) => {
  IDs.forEach((ID) => { $(`#${ID}`).parent('td').addClass(color); });
}

const addWinTime = () => {
  let time =  $('#timer').html()
  $('header').find('h1').after(`<p id="win-timer">${time}</p>`);
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

const resetTable = () => {
  startTime = new Date().getTime();
  shuffleTable($('table'));
  clickedCards.length = 0
  correctCards = 0
  wrong = 0
  resetStars();
  updateMoves();
}

const startTimer = () => {
  setInterval(() => { setTime(); });
}

let startTime = new Date().getTime();
const setTime = () => { // Inspired by: https://www.w3schools.com/howto/howto_js_countdown.asp
  let currentTime = new Date().getTime();
  let passedTime = currentTime - startTime;
  let seconds = Math.floor((passedTime % (1000 * 60)) / 1000);
  let minutes = Math.floor((passedTime % (1000 * 60 * 60)) / (1000 * 60));
  if(seconds <= 9) { seconds = `0${seconds}` }
  return $('#timer').html(`${minutes}:${seconds}`)
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

const error = (card1ID, card2ID) => {
  flashError(card1ID, card2ID)
  changeCardColor([card1ID, card2ID], 'red')
}

let wrong = 0
const flashError = (card1ID, card2ID) => {
  let cardIDs = [card1ID, card2ID]
  removeFlash(cardIDs);
  animateCard(cardIDs, 'shake')
  wrong += 1
  removeStar();
};

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
    case 20:
      swapStars(0, '_half');
      break;
    case 24:
      swapStars(0);
      break;
  }
};

const swapStars = (index, type = '_border') => {
  $('header').find('i')[index].remove();
  $('header i').eq(index).before(createStar(type));
};

const checkRefresh = () => {
  $('#refresh').click(() => {
    resetTable();
  })
}
