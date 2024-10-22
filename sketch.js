let buttons = [];
let lanes = [180, 540, 900];
let buttonImages = [];
let speed = 2;
let timer = 0;
let spawnRate = 1000;
let lastSpawnTime = 0;
let gameActive = true;
let video;

function preload() {
  // Asegúrate de que las imágenes no sean muy pesadas
  buttonImages = ['button.png', 'button2.png', 'button3.png'].map(img => loadImage(img));
  video = createVideo(['video_1.mp4']);
  video.hide();
}

function setup() {
  createCanvas(1080, 1920);
  frameRate(24);
  noSmooth();
  setInterval(spawnButton, spawnRate);
}

function draw() {
  if (gameActive) {
    background(220);
    updateSpeedAndSpawnRate();

    if (millis() - lastSpawnTime > spawnRate) {
      spawnButton();
      lastSpawnTime = millis();
    }

    buttons.forEach((btn, i) => {
      btn.show();
      btn.move();

      // Si el botón sale de la pantalla, lo removemos
      if (btn.y > height) buttons.splice(i, 1);
    });
  }
  }

function spawnButton() {
  if (!gameActive || buttons.length >= 10) return;

  let lane = random(lanes);
  let buttonImage = random(buttonImages);
  buttons.push(new Button(lane, -buttonImage.height, buttonImage));
}

function updateSpeedAndSpawnRate() {
  timer = millis() / 1000;

  if (timer >= 70 && gameActive) {
    gameActive = false;
    stopGameAndPlayVideo();
    return;
  }

  // Ajustar velocidades y tasas de aparición
  let settings = [
    { time: 65, speed: 70, spawnRate: 25 },
    { time: 60, speed: 50, spawnRate: 100 },
    { time: 55, speed: 40, spawnRate: 100 },
    { time: 50, speed: 30, spawnRate: 500 },
    { time: 40, speed: 20, spawnRate: 800 },
    { time: 30, speed: 15, spawnRate: 1500 },
    { time: 24, speed: 10, spawnRate: 10000 },
    { time: 1, speed: 5, spawnRate: 100000 }
  ];

  for (let i = settings.length - 1; i >= 0; i--) {
    if (timer >= settings[i].time) {
      speed = settings[i].speed;
      spawnRate = settings[i].spawnRate;
      break;
    }
  }
}

function stopGameAndPlayVideo() {
  noLoop();
  background(0);
  video.show();
  video.position(0, 0);
  video.size(width, height);
  video.play();
}

class Button {
  constructor(x, y, img) {
    this.x = x;
    this.y = y;
    this.img = img;
    this.clicked = false;
    this.buttonWidth = 350;
    this.buttonHeight = 150;
  }

  show() {
    if (!this.clicked) image(this.img, this.x - this.buttonWidth / 2, this.y, this.buttonWidth, this.buttonHeight);
  }

  move() {
    this.y += speed;
  }

  checkClick() {
    if (
      mouseX > this.x - this.buttonWidth / 2 &&
      mouseX < this.x + this.buttonWidth / 2 &&
      mouseY > this.y &&
      mouseY < this.y + this.buttonHeight
    ) {
      this.clicked = true;
    }
  }
}

function mousePressed() {
  buttons.forEach(btn => btn.checkClick());
}

function touchStarted() {
  mousePressed();
}

