const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;
const Constraints = Matter.Constraints;
const Constraint = Matter.Constraint;

var engine, world;
var scene, ground, rope, rope2, rope3, melon, rabbit, connection, connection2, connection3, cutButton, cutButton2, cutButton3, balloon, muteButton;
var sceneImage, melonImage, rabbitImage;
var blinkAnimation, eatAnimation, sadAnimation;

var BGmusic, ropeCut, eatSound, sadSound, airSound;

function preload() {
  sceneImage = loadImage("assets/background.png");
  melonImage = loadImage("assets/melon.png");
  rabbitImage = loadImage("assets/Rabbit-01.png");

  blinkAnimation = loadAnimation("assets/blink_1.png", "assets/blink_2.png", "assets/blink_3.png");
  eatAnimation = loadAnimation("assets/eat_0.png", "assets/eat_1.png", "assets/eat_2.png", "assets/eat_3.png", "assets/eat_4.png");
  sadAnimation = loadAnimation("assets/sad_1.png", "assets/sad_2.png", "assets/sad_3.png");

  blinkAnimation.playing = true;
  eatAnimation.playing = true;
  sadAnimation.playing = true;

  eatAnimation.looping = false;
  sadAnimation.looping = false

  BGmusic = loadSound("assets/sound1.mp3");
  ropeCut = loadSound("assets/rope_cut.mp3");
  eatSound = loadSound("assets/eating_sound.mp3");
  sadSound = loadSound("assets/sad.mp3");
  airSound = loadSound("assets/air.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  engine = Engine.create();
  world = engine.world;

  BGmusic.play();
  BGmusic.setVolume(0.06)

  cutButton = createImg("assets/cut_btn.png");
  cutButton.position(width / 2, 30);
  cutButton.size(70, 70);
  cutButton.mouseClicked(drop);

  cutButton2 = createImg("assets/cut_btn.png");
  cutButton2.position(width / 2 + 300, 90);
  cutButton2.size(70, 70);
  cutButton2.mouseClicked(drop2);

  cutButton3 = createImg("assets/cut_btn.png");
  cutButton3.position(width / 2 - 250, 90);
  cutButton3.size(70, 70);
  cutButton3.mouseClicked(drop3);

  balloon = createImg("assets/balloon.png");
  balloon.position(150, 220);
  balloon.size(150, 150);
  balloon.mouseClicked(airBlow);

  muteButton = createImg("assets/mute.png");
  muteButton.position(width - 200, 30);
  muteButton.size(100, 100);
  muteButton.mouseClicked(mute);

  blinkAnimation.frameDelay = 20;
  eatAnimation.frameDelay = 20;
  sadAnimation.frameDelay = 20;

  rabbit = createSprite(width / 2 + 200, height - 150, 200, 200);
  rabbit.addAnimation("blinking", blinkAnimation);
  rabbit.addAnimation("eating", eatAnimation);
  rabbit.addAnimation("sad", sadAnimation);
  rabbit.addImage(rabbitImage);
  rabbit.scale = 0.3;

  ground = new Ground(300, 700, 600, 10);

  rope = new Rope(7, {
    x: width / 2 + 20,
    y: 30
  });

  rope2 = new Rope(8, {
    x: width / 2 + 320,
    y: 110
  });

  rope3 = new Rope(8, {
    x: width / 2 - 225,
    y: 90
  });

  melon = Bodies.circle(300, 10, 20);

  Matter.Composite.add(rope.body, melon);
  connection = new Link(rope, melon);
  connection2 = new Link(rope2, melon);
  connection3 = new Link(rope3, melon);

  rectMode(CENTER);
  ellipseMode(RADIUS);
}

function draw() {
  background(sceneImage);

  Engine.update(engine);

  push();
  imageMode(CENTER);
  if (melon != null) {
    image(melonImage, melon.position.x, melon.position.y, 70, 70);
  }
  pop();

  if (collide(melon, rabbit) == true) {
    rabbit.changeAnimation("eating");

    eatSound.play();
  }

  if (melon != null && melon.position.y >= height - 20) {
    rabbit.changeAnimation("sad");
    melon = null;

    sadSound.play();
    BGmusic.stop();

    swal({
      title: `GAME OVER`,
      text: `YOU SNOOZE, YOU LOSE!`,
      imageUrl: `https://www.pngmart.com/files/17/Game-Over-Transparent-PNG.png`,
      imageSize: `200x200`,
      confirmButtonText: `Play Again!`
    }, (isConfirm) => {
      if (isConfirm) {
        location.reload();
      }
    });
  }

  rope.show();
  rope2.show();
  rope3.show();
  drawSprites();
}

function drop() {
  connection.cut();
  connection = null;
  ropeCut.play();
}

function drop2() {
  connection2.cut();
  connection2 = null;
  ropeCut.play();
}

function drop3() {
  connection3.cut();
  connection3 = null;
  ropeCut.play();
}

function collide(body, sprite) {
  if (body != null) {
    var d = dist(body.position.x, body.position.y, sprite.position.x, sprite.position.y);

    if (d <= 80) {
      World.remove(world, melon);
      melon = null;
      return true;
    } else {
      return false;
    }
  }
}

function airBlow() {
  Matter.Body.applyForce(melon, {
    x: 0,
    y: 0
  }, {
    x: 0.02,
    y: 0
  });
  airSound.play();
}

function mute() {
  if (BGmusic.isPlaying()) {
    BGmusic.stop();
  } else {
    BGmusic.play();
  }
}