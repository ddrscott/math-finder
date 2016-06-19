var Random = {
  seed: 0,

  int(min, max) {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    var rnd = this.seed / 233280;
    return parseInt(min + rnd * (max - min));
  }
}

window.Random = Random;
