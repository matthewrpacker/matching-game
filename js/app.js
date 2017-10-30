// Start game with a shuffled deck
$(function() {
  shuffle($("table"));
});

$("#refresh").click(function() {
  shuffle($("table"));
})

// Inspired by: https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
let shuffle = (table) => {
  let icons = table.find("td").children("i");
  for (let i = icons.length - 1; i > 0; i--) {
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
  $('table').find('i').removeClass('white');
  $('table').find('tr, td, i').remove();
  addSquaresY(4);
  addSquaresX(4);
  for(let i=0; i < icons.length; i++){
    $('table').find('td')[i].append(icons[i]);
  }
  addShowCardListener();
};

let addSquaresY = (height) => {
  for(let i=0; i < height; i++){
    $('table').append('<tr></tr>');
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
     $(this).find('i').addClass('white');
  });
};
