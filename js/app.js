var Random = {
  seed: 0,

  int(min, max) {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    var rnd = this.seed / 233280;

    return parseInt(min + rnd * (max - min));
  }
}

var Cell = function(row, col, max) {
  var self = this;

  this.row = row;
  this.col = col;
  this.max = max;

  this.num = Random.int(1, max);
  this.id = function() {
    return 'cell-' + self.row + '-' + self.col;
  };
};

var App = {
  rows: $('input[name="rows"]'),
  cols: $('input[name="cols"]'),
  seed: $('input[name="seed"]'),
  checkSolution: $('input[name="show-solution"]'),
  btnResize: $('.resize'),
  btnSolve: $('.solve'),
  btnRandom: $('.random'),
  btnNext: $('.next'),
  puzzle: [],

  init(opts) {
    var self = this;

    this.max = opts.max;
    this.rows.val(opts.rows);
    this.cols.val(opts.cols);
    this.btnResize.on('click', this.handleGenerate.bind(this));
    this.btnSolve.on('click', this.handleSolve.bind(this));
    this.btnRandom.on('click', this.handleRandom.bind(this));
    this.btnNext.on('click', this.handleNext.bind(this));
    this.seed.on('change', this.handleSeedChange.bind(this));
    this.checkSolution.on('change', this.handleCheckSolution.bind(this));

    // always start with something
    this.handleRandom();

		$(window).on('resize', function(e) {
			clearTimeout(self.timedResize);
			self.timedResize = setTimeout(function() {
        self.handleResize();
			}, 100);
		});
  },

  handleResize() {
    if (this.checkSolution.prop('checked')) {
      this.solve();
      this.renderSolutions();
    }
  },

  handleCheckSolution(e) {
    this.handleSolve(e);
  },

  handleSeedChange(e) {
    $('.puzzle').attr('data-seed', this.seed.val());
  },

  handleGenerate(e) {
    this.puzzle = this.generate(this.rows.val(), this.cols.val());
    this.update();
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
    if ($('.oval').length > 0) {
      $('.oval').remove();
      $('.match').removeClass('match');
      return;
    }

    this.solve();
    this.renderSolutions();
  },

  solve() {
    var puzzle = this.puzzle,
      solutions = $('.solutions');
    solutions.empty();
    puzzle.forEach(row => {
      row.forEach(cell => {
        this.markSums(puzzle, cell, solutions);
      });
    });
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

    $('.oval').each(function(i) {
      alignOval($(this));
    });
  },

    /**
  * Adds 'match2-4' to any cells which sum to the origin cell.
  */
  markSums(puzzle, origin, solutions) {
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
    dirs.forEach((dir) => {
      origin.matches = this.sumDirection(puzzle, origin, dir);
      if (origin.matches) {
        var last = origin.matches[origin.matches.length - 1];
        solutions.append(
          $('<div />')
            .addClass('oval')
            .attr({
              'data-from': origin.id(),
              'data-to': last.id()
            })
        );
        origin.elm.addClass('match')
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
        col.elm = $('<td />').attr('id', col.id()).text(col.num);
        tr.append(col.elm);
      });
      table.append(tr);
    });
    $('.puzzle').html(table);
  },

  generate(numRows, numCols) {
    $('.solutions').empty();
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
