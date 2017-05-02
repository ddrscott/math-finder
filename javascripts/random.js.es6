"use strict";

var Random = {
  seed: 0,

  int: function int(min, max) {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    var rnd = this.seed / 233280;
    return parseInt(min + rnd * (max - min + 1));
  }
};

window.Random = Random;
