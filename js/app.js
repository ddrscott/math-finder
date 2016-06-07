var Random = {
  seed: 0,

  int(min, max) {
    this.seed += 1;
    var digits = Math.sin(this.seed) * 10000;
    return parseInt(Math.abs(digits)) % max + min;
  }
}

var Cell = function(row, col, max) {
  this.row = row;
  this.col = col;
  this.max = max;
  this.num = Random.int(1, max);
};

var App = {
  rows: $('input[name="rows"]'),
  cols: $('input[name="cols"]'),
  seed: $('input[name="seed"]'),
  btnResize: $('.resize'),
  btnSolve: $('.solve'),
  btnRandom: $('.random'),
  puzzle: [],

  init(opts) {
    this.max = opts.max;
    this.rows.val(opts.rows);
    this.cols.val(opts.cols);
    this.btnResize.on('click', this.handleGenerate.bind(this));
    this.btnSolve.on('click', this.handleSolve.bind(this));
    this.btnRandom.on('click', this.handleRandom.bind(this));
    this.seed.on('change', this.handleSeedChange.bind(this));
    
    // always start with something
    this.handleRandom();
  },

  handleSeedChange(e) {
    $('.puzzle').attr('data-seed', this.seed.val());
  },
  
  handleGenerate(e) {
    this.puzzle = this.generate(this.rows.val(), this.cols.val());
    this.update();
  },

  handleRandom(e) {
    this.seed.val(parseInt(Math.random() * 1000));
    this.seed.change();
    this.handleGenerate(e);
  },

  handleSolve(e) {
    var puzzle = this.puzzle;
    puzzle.forEach(row => {
      row.forEach(cell => {
        this.markSums(puzzle, cell);
      });
    });
  },

  /**
   * Adds 'match2-4' to any cells which sum to the origin cell.
   */
  markSums(puzzle, origin) {
    var dirs = [
      [1, 0],   // right
      [-1, 0],  // left
      [0, 1],   // down
      [0, -1],  // up
      [1, 1],   // right/down
      [1, -1],  // right/up
      [-1, 1],  // left/down
      [-1, -1], // left/up
    ];
    dirs.forEach((dir) => {
      origin.matches = this.sumDirection(puzzle, origin, dir);
      if (origin.matches) {
        var matchCls = 'match' + origin.matches.length;
        origin.matches.forEach(m => m.elm.addClass(matchCls));
        origin.elm.addClass(matchCls)
      }
    });
  },

  /**
   * Sums up cells in direction `dir`. Until it's equal or too many.
   * There must be at least 2 cells.
   * @return an array of matching cells or false
   */
  sumDirection(puzzle, cell, dir) {
    var cells = [],
      sum = 0;
    do {
      var nextRow = puzzle[dir[0] * (cells.length + 1) + cell.row];
      if (nextRow == undefined) {
        return false;
      }
      var nextCell = nextRow[dir[1] * (cells.length + 1) + cell.col];
      if (nextCell == undefined) {
        return false;
      }
      cells.push(nextCell);
      sum += nextCell.num;
    } while (sum < cell.num);
    if (sum == cell.num && cells.length > 1) {
      return cells;
    }
    return false;
  },

  update() {
    this.render(this.puzzle);
  },

  render(puzzle) {
    var table = $('<table />');
    puzzle.forEach(row => {
      var tr = $('<tr/>');
      row.forEach(col => {
        col.elm = $('<td/>').text(col.num);
        tr.append(col.elm);
      });
      table.append(tr);
    });
    $('.puzzle').html(table);
  },

  generate(numRows, numCols) {
    // reset the seed
    Random.seed = parseInt(this.seed.val());

    var rows = [];
    for (var r = 0; r < numRows; r++) {
      var cols = [];
      for (var c = 0; c < numCols; c++) {
        cols.push(new Cell(r, c, this.max));
      }
      rows.push(cols);
    }
    return rows;
  }
}
App.init({
  rows: 15,
  cols: 15,
  max: 15
});
