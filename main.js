// TODO: put the text on the left in a 1/3 ish column and the game in the right 2/3rds



var rows = 10;
var columns = 10;
var $row = $("<div />", {
    class: 'ROWS'
});
var $square = $("<div />", {
    class: 'square'
});

$(document).ready(function () {
    $('#gameDiv').append($row);
    //add columns to the the temp row object
    for (var i = 0; i < columns; i++) {
        $row.append($square.clone().addClass("column" + i));
    }
    //clone the temp row object with the columns to the wrapper
    for (var j = 0; j < rows; j++) {
        $("#wrapper").append($row.clone().addClass("row" + j));
    }

    $('.square').on('click', turnGreen);
    $('.step').on('click', liveOrDie);
    $('.run').on('click', goGoGo);
    $('.pause').on('click', stopStop);
    $('.clear').on('click', clearBoard);
});

// Click to make life
function turnGreen() {
  var $el = $(this);
  $el
    .addClass("alive")
    .off("click", turnGreen)
    .on("click", death);
}

function death() {
  var $el = $(this);
  $el
    .removeClass("alive")
    .off('click', death)
    .on("click", turnGreen)
  // $(this).removeClass("alive");
}

// Start building out the logic
// Build a map of the alive cells
function makeMap(row, column) {
  var map = [];
  var temp = []
  row = row || $('.row0');

   function colAnalyze(row) {
    for ( var i = 0; i < row.children().length; i++ ) {
      var square = row.children()[i]

      if ( square.classList.contains('alive') ) {
        temp.push(1);
      } else {
        temp.push(0);
      }
    }
    map.push(temp);
    temp = []
    return map;
  }

  // Iterate over rows
  for ( var j = 0; j < row.children().length; j++ ) {
    colAnalyze($('.row'+j));
  }

  return map;
}


// Write a function that checks all of the neighbors 
  // This must be done in 'one step of time'
function checkNeighbors(r, c, checkThis) {
  // keep count
  var total = 0;

  // check row above
  function topRow(r,c) {
    var neighbors = 0;
    if ( checkThis[r - 1] ) {
      if ( checkThis[r - 1][c - 1] === 1 ) {
        neighbors += 1;
      }
      if ( checkThis[r - 1][c] === 1) {
        neighbors += 1;
      }
      if ( checkThis[r - 1][c + 1] === 1) {
        neighbors += 1;
      }
    }
    return neighbors
  }
  // check sides
  function sides(r,c) {
    var neighbors = 0;
    if ( checkThis[r][c - 1] === 1 ) {
      neighbors += 1;
    }
    if ( checkThis[r][c + 1] === 1) {
      neighbors += 1;
    }
    return neighbors
  }
  // check row below
  function belowRow(r,c) {
    var neighbors = 0;
    if ( checkThis[r + 1] ) {
      if ( checkThis[r + 1][c - 1] === 1 ) {
        neighbors += 1;
      }
      if ( checkThis[r + 1][c] === 1) {
        neighbors += 1;
      }
      if ( checkThis[r + 1][c + 1] === 1) {
        neighbors += 1;
      }
    }
    return neighbors
  }

  total = topRow(r,c) + sides(r,c) + belowRow(r,c);
  return total
}


// If 2 or 3 neighbors are alive then keep class alive 
// else die. (from lonliness or overcrowding)
var liveOrDie = function() {
  var oldMap = makeMap()
  var cellsToDie = [];
  var cellsToLive = [];
// iterate over whole matrix
  for ( var r = 0; r < rows; r++ ) {
    for ( var c = 0; c < columns; c++ ) {
      // pass this into something that checks top, sides, and botton
      if ( checkNeighbors(r,c, oldMap) > 3) { 
        // kill the cell 
        cellsToDie.push([r,c]);
      } else if ( checkNeighbors(r,c,oldMap) < 2) {
        cellsToDie.push([r,c]);
      } else if ( checkNeighbors(r,c,oldMap) === 3) {
        // bring the cell to life
        cellsToLive.push([r,c]);
      }
    }
  } 
  for ( var i = 0; i < cellsToDie.length; i++ ) {
    var row = cellsToDie[i][0];
    var col = cellsToDie[i][1];
    $($('.row'+row).children()[col]).removeClass('alive')
  }
  for ( var j = 0; j < cellsToLive.length; j++ ) {
    var row = cellsToLive[j][0];
    var col = cellsToLive[j][1];
    $($('.row'+row).children()[col]).addClass('alive')
  }
}

var timeouts = []; // timeouts array
function goGoGo() {
  timeouts.push(setInterval(function() { return liveOrDie()}, 500));
}

function stopStop() {
  clearInterval(timeouts[0]);
  timeouts.pop();

}

function clearBoard() {
  for(i = 0; i < rows; i++) {
    for (j = 0; j < columns; j++) {
      console.log(i, j);
      $($('.row'+i).children()[j]).removeClass('alive')
    }
  }
} 

// TODO: Create a function that simple loops over the array and refactor stuff out to here
// TODO: When cells to live array is created checked if it is empty at end of a round, if it is run stopStop



