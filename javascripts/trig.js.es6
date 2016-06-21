'use strict';

var Trig = {
  center: function center(e) {
    var offset = e.offset();
    return {
      x: offset.left + e.outerWidth() / 2,
      y: offset.top + e.outerHeight() / 2
    };
  },

  midpoint: function midpoint(p1, p2) {
    return {
      x: (p2.x + p1.x) / 2,
      y: (p2.y + p1.y) / 2
    };
  },

  rotate: function rotate(elm, degrees) {
    $(elm).css({
      '-webkit-transform': 'rotate(' + degrees + 'deg)',
      '-moz-transform': 'rotate(' + degrees + 'deg)',
      '-ms-transform': 'rotate(' + degrees + 'deg)',
      'transform': 'rotate(' + degrees + 'deg)'
    });
  },

  alignOval: function alignOval(oval) {
    // element
    var e1 = $('#' + oval.data('from')),
        e2 = $('#' + oval.data('to')),
        minDim = 0.6 * Math.min(e1.outerWidth(), e1.outerHeight(), e2.outerWidth(), e2.outerHeight()),

    // centers
    c1 = this.center(e1),
        c2 = this.center(e2),

    // midpoint
    mid = this.midpoint(c2, c1),

    // distance between center points
    dx2 = Math.pow(c2.x - c1.x, 2),
        dy2 = Math.pow(c2.y - c1.y, 2),
        dist = Math.sqrt(dx2 + dy2);

    // set oval dimensions
    oval.height(minDim);
    oval.width(dist + minDim);

    // align center of oval with midpoint between elements
    oval.offset({
      left: mid.x - oval.outerWidth() / 2,
      top: mid.y - oval.outerHeight() / 2
    });

    // angle between element centers
    var deg = Math.atan2(c2.y - c1.y, c2.x - c1.x) * 180 / Math.PI;

    this.rotate(oval, deg);
  }
};
window.Trig = Trig;
