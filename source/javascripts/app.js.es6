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
  },

  parseSeedFromLocation() {
    var seed = window.location.hash.replace(/\D/g, '');
    if (seed.length > 0) {
      this.seed.val(seed);
      this.handleGenerate(); 
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

    this.renderHints(this.checkHint.prop('checked'));

    if (this.checkSolution.prop('checked')) {
      this.renderSolutions();
    }
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
    var $problems = $('.problems');
    $problems.empty();
    this.puzzle.problems.forEach((prob) => {
      const copy = prob.slice(),
        $answer = $('<span class="answer" />').text(copy.shift()),
        $parts = $('<span class="parts" />').text(copy.reverse().join(" + ")),
        $li = $('<li class="problem" />').append($parts).append(" = ").append($answer);

      $problems.append($li);
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
    const $puzzle = $('.puzzle'),
      $table = $('<table />');

    puzzle.forEach(row => {
      var tr = $('<tr/>');
      row.forEach(col => {
        col.elm = $('<td id="' + col.id() + '" class="td--cell" />')
          .append($('<div class="cell"/>').text(col.num));
        tr.append(col.elm);
      });
      $table.append(tr);
    });
    $puzzle.empty();
    $puzzle
      .append($('<div class="solutions" />'))
      .append($table);
    this.renderProblems();
  },
}

App.init({
  rows: 15,
  cols: 15,
  max: 15
});

window.App = App;
