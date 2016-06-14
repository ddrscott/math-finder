var Random = {
  seed: 0,

  int(min, max) {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    var rnd = this.seed / 233280;
    return parseInt(min + rnd * (max - min));
  }
}

var Cell = function(row, col, min, max) {
  var self = this;

  this.row = row;
  this.col = col;
  this.min = min;
  this.max = max;

  this.num = Random.int(min, max);
  this.id = function() {
    return 'cell-' + self.row + '-' + self.col;
  };
};

var Puzzle = function(options) {
  this.numRows = parseInt(options.rows || 3);
  this.numCols = parseInt(options.cols || 3);
  this.minNum  = parseInt(options.min  || 1);
  this.maxNum  = parseInt(options.max  || 1);
  this.seed    = parseInt(options.seed || 1);

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

    var dirs = [
      [1, 0], // right
      [-1, 0], // left
      [0, 1], // down
      [0, -1], // up
      [1, 1], // right/down
      [1, -1], // right/up
      [-1, 1], // left/down
      [-1, -1], // left/up
    ];

    rows.forEach(row => {
      row.forEach(origin => {
        dirs.forEach((dir) => {
          origin.matches = findMatches(rows, origin, dir);
          if (origin.matches) {
            problems.push([origin, ...origin.matches]);
          }
        });
      });
    });
    return problems.sort();
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

  // public functions
  this.forEach = function(callback) {
    this.rows.forEach(callback);
  };
};

var App = {
  rows: $('input[name="rows"]'),
  cols: $('input[name="cols"]'),
  seed: $('input[name="seed"]'),
  checkSolution: $('input[name="show-solution"]'),
  checkHint: $('input[name="show-hint"]'),
  btnResize: $('.resize'),
  btnSolve: $('.solve'),
  btnRandom: $('.random'),
  btnNext: $('.next'),

  init(opts) {
    var self = this;

    this.max = opts.max;
    this.rows.val(opts.rows);
    this.cols.val(opts.cols);
    this.btnResize.on('click', this.handleGenerate.bind(this));
    this.btnSolve.on('click', this.handleSolve.bind(this));
    this.btnRandom.on('click', this.handleRandom.bind(this));
    this.btnNext.on('click', this.handleNext.bind(this));
    this.checkSolution.on('change', this.handleCheckSolution.bind(this));
    this.checkHint.on('change', (e) => {this.renderHints(e.target.checked)});

    // always start with something
    this.parseSeedFromLocation();
    if (this.puzzle == undefined) {
      this.handleRandom();
    }

		$(window).on('resize', function(e) {
			clearTimeout(self.timedResize);
			self.timedResize = setTimeout(function() {
        self.handleResize();
			}, 100);
		});
  },

  parseSeedFromLocation() {
    var seed = window.location.hash.replace(/\D/g, '');
    if (seed.length > 0) {
      this.seed.val(seed);
      this.handleGenerate(); 
    }
  },

  handleResize() {
    this.renderHints(this.checkHint.prop('checked'));

    if (this.checkSolution.prop('checked')) {
      this.renderSolutions();
    }
  },

  handleCheckSolution(e) {
    this.handleSolve(e);
  },

  handleGenerate(e) {
    this.puzzle = new Puzzle({
      rows: this.rows.val(),
      cols: this.cols.val(),
      seed: this.seed.val(),
      min: 1,
      max: this.max
    });

    window.location.hash = this.seed.val();

    $('.problem-count').text(this.puzzle.problems.length);
    this.render(this.puzzle);

    this.handleResize();
  },

  handleNext(e) {
    this.seed.val(parseInt(this.seed.val() || '0') + 1);
    this.seed.change();
    this.handleGenerate(e);
  },

  handleRandom(e) {
    this.seed.val(parseInt(Math.random() * 1000));
    this.seed.change();
    this.handleGenerate(e);
  },

  handleSolve(e) {
    if (this.checkSolution.prop('checked')) {
      this.renderSolutions();
    } else {
      $('.solutions').empty();
    }
  },

  renderHints(show) {
    this.puzzle.problems.forEach((prob) => {
      var origin = prob[0];
      if (show) {
        origin.elm.addClass('match')
      } else {
        origin.elm.removeClass('match')
      }
    });
  },

  renderProblems() {
    var problems = $('.problems'); 
  },

  renderSolutions() {
    function center(e) {
      var offset = e.offset();
      return {
        x: offset.left + e.outerWidth() / 2,
        y: offset.top + e.outerHeight() / 2
      };
    }

    function midpoint(p1, p2) {
      return {
        x: (p2.x + p1.x) / 2,
        y: (p2.y + p1.y) / 2
      }
    }

    function rotate(elm, degrees) {
      $(elm).css({
        '-webkit-transform': 'rotate(' + degrees + 'deg)',
        '-moz-transform': 'rotate(' + degrees + 'deg)',
        '-ms-transform': 'rotate(' + degrees + 'deg)',
        'transform': 'rotate(' + degrees + 'deg)'
      });
    }

	  function alignOval(oval) {
      // element
      var e1 = $('#' + oval.data('from')),
        e2 = $('#' + oval.data('to')),

        minDim = 0.6 * Math.min(e1.outerWidth(), e1.outerHeight(), e2.outerWidth(), e2.outerHeight()),

        // centers
        c1 = center(e1),
        c2 = center(e2),

        // midpoint
        mid = midpoint(c2, c1),

        // distance between center points
        dx2 = Math.pow(c2.x - c1.x, 2),
        dy2 = Math.pow(c2.y - c1.y, 2),
        dist = Math.sqrt(dx2 + dy2);

      // set oval dimensions
      oval.height(minDim);
      oval.width(dist + minDim);

      // align center of oval with midpoint between elements
      oval.offset({
        left: mid.x - (oval.outerWidth() / 2),
        top: mid.y - (oval.outerHeight() / 2)
      });

      // angle between element centers
      var deg = Math.atan2(c2.y - c1.y, c2.x - c1.x) * 180 / Math.PI;

      rotate(oval, deg);
    }

    var $solutions = $('.solutions');
    $solutions.empty();
    this.puzzle.problems.forEach((prob) => {
      var origin = prob[0],
          last = prob[prob.length - 1],
          $oval = $('<div />').addClass('oval').attr({
            'data-from': origin.id(),
            'data-to': last.id()
          });

      $solutions.append($oval);
      alignOval($oval);
    });
  },

  render(puzzle) {
    var $table = $('<table />');
    puzzle.forEach(row => {
      var tr = $('<tr/>');
      row.forEach(col => {
        col.elm = $('<td id="' + col.id() + '" class="td--cell" />')
          .append($('<div class="cell"/>').text(col.num));
        tr.append(col.elm);
      });
      $table.append(tr);
    });
    $('.puzzle').html($table);
  },
}

App.init({
  rows: 15,
  cols: 15,
  max: 15
});

window.App = App;
