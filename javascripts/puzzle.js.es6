"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var Puzzle = function Puzzle(options) {
  this.numRows = parseInt(options.rows || 3);
  this.numCols = parseInt(options.cols || 3);
  this.minNum = parseInt(options.min || 1);
  this.maxNum = parseInt(options.max || 1);
  this.seed = parseInt(options.seed || 1);

  generate(this);

  function generate(puzzle) {
    Random.seed = puzzle.seed;
    var rows = [];
    for (var r = 0; r < puzzle.numRows; r++) {
      var cols = [];
      for (var c = 0; c < puzzle.numCols; c++) {
        cols.push(new Cell(r, c, puzzle.minNum, puzzle.maxNum));
      }
      rows.push(cols);
    }
    puzzle.rows = rows;
    puzzle.problems = findProblems(rows);
  }

  function findProblems(rows) {
    var problems = [];

    var dirs = [[1, 0], // right
    [-1, 0], // left
    [0, 1], // down
    [0, -1], // up
    [1, 1], // right/down
    [1, -1], // right/up
    [-1, 1], // left/down
    [-1, -1]];

    // left/up
    rows.forEach(function (row) {
      row.forEach(function (origin) {
        dirs.forEach(function (dir) {
          origin.matches = findMatches(rows, origin, dir);
          if (origin.matches) {
            var cells = [origin].concat(_toConsumableArray(origin.matches));
            problems.push({
              cells: cells,
              origin: origin,
              sort: cells.length * 1000 + origin.num,
              last: cells[cells.length - 1],
              length: cells.length,
              solved: false
            });
          }
        });
      });
    });
    return problems.sort(function (a, b) {
      return a.sort - b.sort;
    });
  }

  /**
   * Sums up cells in direction `dir`. Until it's equal or too many.
   * There must be at least 2 cells.
   * @return an array of matching cells or false
   */
  function findMatches(rows, origin, dir) {
    var cells = [],
        sum = 0;
    do {
      var nextRow = rows[dir[0] * (cells.length + 1) + origin.row];
      if (nextRow == undefined) {
        return false;
      }
      var nextCell = nextRow[dir[1] * (cells.length + 1) + origin.col];
      if (nextCell == undefined) {
        return false;
      }
      cells.push(nextCell);
      sum += nextCell.num;
    } while (sum < origin.num);
    if (sum == origin.num && cells.length > 1) {
      return cells;
    }
    return false;
  }

  this.validateSelection = function (startId, endId, matchCallback) {
    this.problems.some(function (prob) {
      var origin = prob.origin;
      var last = prob.last;

      if (origin.id() == startId && last.id() == endId || origin.id() == endId && last.id() == startId) {
        matchCallback(prob);
        return true;
      }
    });
  };

  this.remaining = function () {
    return this.problems.reduce(function (sum, prob) {
      return prob.solved ? sum - 1 : sum;
    }, this.problems.length);
  };

  // public functions
  this.forEach = function (callback) {
    this.rows.forEach(callback);
  };
};

window.Puzzle = Puzzle;
