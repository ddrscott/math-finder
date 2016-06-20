'use strict';

var Cell = function Cell(row, col, min, max) {
  var self = this;

  this.row = row;
  this.col = col;
  this.min = min;
  this.max = max;

  this.num = Random.int(min, max);
  this.id = function () {
    return 'cell-' + self.row + '-' + self.col;
  };
};
Cell.prototype.toString = function () {
  return this.num.toString();
};
window.Cell = Cell;
