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
  remaining: $('.remaining'),

  init(opts) {
    var self = this;

    // bind events
    this.btnResize.on('click', this.handleGenerate.bind(this));
    this.btnSolve.on('click', this.handleSolve.bind(this));
    this.btnRandom.on('click', this.handleRandom.bind(this));
    this.btnNext.on('click', this.handleNext.bind(this));
    this.checkSolution.on('change', this.handleCheckSolution.bind(this));
    this.checkHint.on('change', (e) => {this.renderHints(e.target.checked)});

    // read options
    this.max = opts.max;
    this.rows.val(opts.rows);
    this.cols.val(opts.cols);
    this.seed.val(opts.seed);

    this.handleGenerate();

    var hammer = new Hammer($('.puzzle')[0]);
    hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL, threshold: 1 });
    hammer.on('pan', this.handleTouch.bind(this));
    hammer.on('panstart', this.handleTouchStart.bind(this));
  },

  fromHash(hash) {
    var result = {},
        pairs = hash.split(",");

    for (var i=0;i<pairs.length;i++) {
      var pair = pairs[i].split("=");
      if (pair[1]) {
        result[pair[0]] = pair[1]; 
      }
    }
    return result;
  },

  toHash(puzzle) {
    return "rows=" + puzzle.numRows + "," +
      "cols=" + puzzle.numCols + "," +
      "max=" + puzzle.maxNum + "," +
      "seed=" + puzzle.seed
  },


  cellAt(point) {
    return document.elementsFromPoint(point.x, point.y).filter(function(elm){ return elm.className == 'cell' })[0];
  },

  handleTouchStart(e) {
    this.touchStart = this.cellAt(e.center);
    this.touchEnd = false;
  },

  handleTouch(e) {
    if (this.touchStart) {
      this.touchEnd = this.cellAt(e.center);
      this.renderSelection(this.touchStart, this.touchEnd);
    }
    if (e.isFinal && this.touchEnd) {
      this.validateSelection(this.touchStart, this.touchEnd);
      this.touchStart = false; 
    }
  },

  validateSelection(startElm, endElm) {
    console.log(startElm, endElm);

    var valid = false;
    this.puzzle.validateSelection(startElm.id, endElm.id, (prob) => {
      valid = true;
      prob.solved = true;
      $('.selection').addClass('found').removeClass('selection');
      this.renderRemaining();
    });
    if (!valid) {
      $('.selection').addClass('invalid')
    }
  },

  renderRemaining() {
    const r = this.puzzle.remaining(),
          plural = r == 1 ? ' problem' : ' problems';
    $('.remaining-num').text(r);
    $('.remaining-label').text(plural + ' left.');
  },

  renderSelection(startElm, endElm) {
    if (!startElm || !endElm) {
      return;
    }
    // add oval if needed
    var $selection = $('.selection').remove();
    $selection = $('<div class="oval selection" />');
    $('.solutions').append($selection);

    $selection.data({'from': startElm.id, 'to': endElm.id});
    Trig.alignOval($selection);
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

    window.location.hash = this.toHash(this.puzzle);

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
      $('.solution').remove();
    }
  },

  renderHints(show) {
    this.puzzle.problems.forEach((prob) => {
      var origin = prob.cells[0];
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
      const copy = prob.cells.slice(),
        $answer = $('<span class="answer" />').text(copy.shift()),
        $parts = $('<span class="parts" />').text(copy.reverse().join(" + ")),
        $li = $('<li class="problem" />').append($parts).append(" = ").append($answer);

      $problems.append($li);
    });
  },

  renderSolutions() {
    var $solutions = $('.solutions');
    $solutions.find('.solution').remove();
    this.puzzle.problems.forEach((prob) => {
      var origin = prob.origin,
        last = prob.last,
        $oval = $('<div />')
          .addClass('solution oval')
          .attr({'data-from': origin.id(), 'data-to': last.id()});

      $solutions.append($oval);
      Trig.alignOval($oval);
    });
  },

  render(puzzle) {
    const $puzzle = $('.puzzle'),
      $table = $('<table />');

    puzzle.forEach(row => {
      var tr = $('<tr/>');
      row.forEach(col => {
        col.elm = $('<td class="td--cell" />')
          .append($('<div class="cell" id="' + col.id() + '" />').text(col.num));
        tr.append(col.elm);
      });
      $table.append(tr);
    });
    $puzzle.empty();
    $puzzle
      .append($('<div class="solutions" />'))
      .append($table);
    this.renderProblems();
    this.renderRemaining();
  },
}

$(document).ready(() => {
  var query = App.fromHash(window.location.hash.substring(1));
  if (Object.keys(query).length > 0) {
    App.init(query);
  } else {
    // auto generate everything
    App.init({
      rows: Math.min(15, parseInt($(window).height() * 0.8 / 16 / 2.75)),
      cols: Math.min(15, parseInt($(window).width() * 0.9 / 16 / 2.75)),
      max: 15,
      seed: parseInt(Math.random() * 999)
    });
  }
});

window.App = App;
