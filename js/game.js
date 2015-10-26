// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "assets/images/background.png";

// Hero image
//var heroReady = false;
//var heroImage = new Image();
//heroImage.onload = function () {
//	heroReady = true;
//};
//heroImage.src = "assets/images/hero.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "assets/images/monster.png";

// Hero animation
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "assets/images/herospritesheet.png"

function sprite (options) {
          
  var that = {},
    frameIndex = 0,
    tickCount = 0,
    ticksPerFrame = 16
    numberOfFrames = 2;
                
  that.speed = options.speed;
  that.x = options.x;
  that.y = options.y;
  that.context = options.context;
  that.width = options.width;
  that.height = options.height;
  that.image = options.image;

  that.update = function () {
    tickCount += 1;

    if (tickCount > ticksPerFrame) {
      tickCount = 0;
      // If the current frame index is in range
      if (frameIndex < numberOfFrames - 1) {
        // Go to next frame
        frameIndex += 1;
      } else {
        frameIndex = 0;
      }
    }
  }
  
  that.render = function () {
    // Draw the animation

    that.context.drawImage(
      that.image,
      frameIndex * that.width / numberOfFrames,
      0,
      that.width / numberOfFrames,
      that.height,
      that.x,
      that.y,
      that.width / numberOfFrames,
      that.height);
  };

  return that;
}

var hero = sprite({
  speed: 256,
  x: canvas.width / 2,
  y: canvas.height / 2,
  context: canvas.getContext("2d"),
  width: 88,
  height: 88,
  image: heroImage
})

// Game objects
//var hero = {
//	speed: 256, // movement in pixels per second
//	health: 100
//};
var monster = {};
var monstersCaught = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
var reset = function () {
//        spawnHero();
        spawnMonster();
};

// Spawn Hero
var spawnHero = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;
};
// Spawn Monster
var spawnMonster = function () {
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.height - 64));
};

// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		hero.y -= hero.speed * modifier;
	}
	if (40 in keysDown) { // Player holding down
		hero.y += hero.speed * modifier;
	}
	if (37 in keysDown) { // Player holding left
		hero.x -= hero.speed * modifier;
	}
	if (39 in keysDown) { // Player holding right
		hero.x += hero.speed * modifier;
	}
	
	if (hero.x > canvas.width) 
	{
		hero.x = 0;
	}
	if (hero.x < 0)
	{
		hero.x=canvas.width;
	}	
	if (hero.y > canvas.height)
	{
		hero.y=0;
	}
	if (hero.y<0)
	{
		hero.y=canvas.height;
	}
	
		if (monster.x > canvas.width) 
	{
		monster.x = 0;
	}
	if (monster.x < 0)
	{
		monster.x=canvas.width;
	}	
	monster.x+=1;

	//hero.health-= 1 
	
	// Are they touching?
	if (
		hero.x <= (monster.x + 32)
		&& monster.x <= (hero.x + 32)
		&& hero.y <= (monster.y + 32)
		&& monster.y <= (hero.y + 32)
	) {
		++monstersCaught;
		++hero.health;
		spawnMonster();
		if(monstersCaught >3){
			monsterImage.src = "assets/images/monster2.png";
		}

	}
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

//	if (heroReady) {
//		ctx.drawImage(heroImage, hero.x, hero.y);
//	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);
//	ctx.fillText("Health: " + hero.health, 32, 72);
};

// The main game loop
var main = function () {
	var now = Date.now();
	
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
        hero.update();
        hero.render();
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();
