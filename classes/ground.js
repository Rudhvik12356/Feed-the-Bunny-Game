class Ground {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;

    var options = {
      isStatic: true
    }

    this.body = Bodies.rectangle(x, y, w, h, options);
    this.w = w;
    this.h = h;
    World.add(world, this.body);
  }

  show() {
    var pos = this.body.position;

    push();
    noStroke();
    rectMode(CENTER);
    fill(146, 127, 148);
    rect(pos.x, pos.y, this.w, this.h);
    pop();
  }
}