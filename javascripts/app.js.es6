'use strict';

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

  init: function init(opts) {
    var _this = this;

    var self = this;

    // bind events
    this.btnResize.on('click', this.handleGenerate.bind(this));
    this.btnSolve.on('click', this.handleSolve.bind(this));
    this.btnRandom.on('click', this.handleRandom.bind(this));
    this.btnNext.on('click', this.handleNext.bind(this));
    this.checkSolution.on('change', this.handleCheckSolution.bind(this));
    this.checkHint.on('change', function (e) {
      _this.renderHints(e.target.checked);
    });

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

  fromHash: function fromHash(hash) {
    var result = {},
        pairs = hash.split(",");

    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i].split("=");
      if (pair[1]) {
        result[pair[0]] = pair[1];
      }
    }
    return result;
  },

  toHash: function toHash(puzzle) {
    return "rows=" + puzzle.numRows + "," + "cols=" + puzzle.numCols + "," + "max=" + puzzle.maxNum + "," + "seed=" + puzzle.seed;
  },

  cellAt: function cellAt(point) {
    return document.elementsFromPoint(point.x, point.y).filter(function (elm) {
      return elm.className == 'cell';
    })[0];
  },

  handleTouchStart: function handleTouchStart(e) {
    this.touchStart = this.cellAt(e.center);
    this.touchEnd = false;
  },

  handleTouch: function handleTouch(e) {
    if (this.touchStart) {
      this.touchEnd = this.cellAt(e.center);
      this.renderSelection(this.touchStart, this.touchEnd);
    }
    if (e.isFinal && this.touchEnd) {
      this.validateSelection(this.touchStart, this.touchEnd);
      this.touchStart = false;
    }
  },

  validateSelection: function validateSelection(startElm, endElm) {
    var _this2 = this;

    console.log(startElm, endElm);

    var valid = false;
    this.puzzle.validateSelection(startElm.id, endElm.id, function (prob) {
      valid = true;
      prob.solved = true;
      $('.selection').addClass('found').removeClass('selection');
      _this2.renderRemaining();
    });
    if (!valid) {
      $('.selection').addClass('invalid');
    }
  },

  renderRemaining: function renderRemaining() {
    var r = this.puzzle.remaining(),
        plural = r == 1 ? ' problem' : ' problems';
    $('.remaining-num').text(r);
    $('.remaining-label').text(plural + ' left.');
  },

  renderSelection: function renderSelection(startElm, endElm) {
    if (!startElm || !endElm) {
      return;
    }
    // add oval if needed
    var $selection = $('.selection').remove();
    $selection = $('<div class="oval selection" />');
    $('.solutions').append($selection);

    $selection.data({ 'from': startElm.id, 'to': endElm.id });
    Trig.alignOval($selection);
  },

  handleCheckSolution: function handleCheckSolution(e) {
    this.handleSolve(e);
  },

  handleGenerate: function handleGenerate(e) {
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

  handleNext: function handleNext(e) {
    this.seed.val(parseInt(this.seed.val() || '0') + 1);
    this.seed.change();
    this.handleGenerate(e);
  },

  handleRandom: function handleRandom(e) {
    this.seed.val(parseInt(Math.random() * 1000));
    this.seed.change();
    this.handleGenerate(e);
  },

  handleSolve: function handleSolve(e) {
    if (this.checkSolution.prop('checked')) {
      this.renderSolutions();
    } else {
      $('.solution').remove();
    }
  },

  renderHints: function renderHints(show) {
    this.puzzle.problems.forEach(function (prob) {
      var origin = prob.cells[0];
      if (show) {
        origin.elm.addClass('match');
      } else {
        origin.elm.removeClass('match');
      }
    });
  },

  renderProblems: function renderProblems() {
    var $problems = $('.problems');
    $problems.empty();
    this.puzzle.problems.forEach(function (prob) {
      var copy = prob.cells.slice(),
          $answer = $('<span class="answer" />').text(copy.shift()),
          $parts = $('<span class="parts" />').text(copy.reverse().join(" + ")),
          $li = $('<li class="problem" />').append($parts).append(" = ").append($answer);

      $problems.append($li);
    });
  },

  renderSolutions: function renderSolutions() {
    var $solutions = $('.solutions');
    $solutions.find('.solution').remove();
    this.puzzle.problems.forEach(function (prob) {
      var origin = prob.origin,
          last = prob.last,
          $oval = $('<div />').addClass('solution oval').attr({ 'data-from': origin.id(), 'data-to': last.id() });

      $solutions.append($oval);
      Trig.alignOval($oval);
    });
  },

  render: function render(puzzle) {
    var $puzzle = $('.puzzle'),
        $table = $('<table />');

    puzzle.forEach(function (row) {
      var tr = $('<tr/>');
      row.forEach(function (col) {
        col.elm = $('<td class="td--cell" />').append($('<div class="cell" id="' + col.id() + '" />').text(col.num));
        tr.append(col.elm);
      });
      $table.append(tr);
    });
    $puzzle.empty();
    $puzzle.append($('<div class="solutions" />')).append($table);
    this.renderProblems();
    this.renderRemaining();
  }
};

$(document).ready(function () {
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
