$("#refresh").click(function() {
  shuffle($("table"));
})

// Inspired by: https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
let shuffle = (table) => {
  let tds = table.find("td").children("i");
  for (let i = tds.length - 1; i > 0; i--) {
    let j = randomWithin(i);
    let x = tds[i];
    tds[i] = tds[j];
    tds[j] = x;
  }
  createTable(tds);
}

let randomWithin = (number) => {
  return Math.floor(Math.random() * (number + 1));
}

let createTable = (tds) => {
  $('table').find('tr, td, i').remove();
  addSquaresY(4);
  addSquaresX(4);
  for(let i=0; i < tds.length; i++){
    $('table').find('td')[i].append(tds[i]);
  }
}

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
