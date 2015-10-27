// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);
var hero;
var orcs = [];
// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "assets/images/background.png";



function sprite (options) {
          
  var that = {},
    frameIndex = 0,
    tickCount = 0,
    ticksPerFrame = options.ticksPerFrame || 0;
    numberOfFrames = options.numberOfFrames || 1;
                
  that.speed = options.speed;
  that.x = 0;
  that.y = 0;
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

function spawnHero () {
  // Create sprite sheet
  var heroImage = new Image();

  // Create sprite
  hero = sprite({
    speed: 256,
    ticksPerFrame: 16,
    numberOfFrames: 2,
    context: canvas.getContext("2d"),
    width: 88,
    height: 88,
    image: heroImage
  })
  hero.x = canvas.width / 2;
  hero.y = canvas.height / 2;
  heroImage.src = "assets/images/herospritesheet.png"
}

function spawnOrc () {
  
  var orcIndex;
  // Create sprite sheet
  var orcImage = new Image();
  orcIndex = orcs.length;
  
  // Create sprite
  orcs[orcIndex] = sprite({
    speed: 256,
    ticksPerFrame: 16,
    numberOfFrames: 2,
    context: canvas.getContext("2d"),
    width: 88,
    height: 88,
    image: orcImage
  })
  orcs[orcIndex].x = 32 + (Math.random() * (canvas.width - 64));
  orcs[orcIndex].y = 32 + (Math.random() * (canvas.height - 64));
  
  orcImage.src = "assets/images/monsterspritesheet.png";
}

function destroyOrc (orc) {
  for (var i = 0; i < orcs.length; i += 1) {
    if (orcs[i] === orc) {
      orcs[i] = null;
      orcs.splice(i, 1);
      break;
    }
  }
}

// Game objects
var orcsCaught = 0;
var hoard = 1;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches an orc
var initialize = function () {
        spawnHero();
        spawnOrc();
        spawnOrc();
        spawnOrc();
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
	for (var i = 0; i < orcs.length; i += 1) {
          if (orcs[i].x > canvas.width) {
            orcs[i].x = 0;
          } else if (orcs[i].x < 0) {
            orcs[i].x = canvas.width;
          }
          orcs[i].x += 1;
        }
        
        // Are they touching?
	for (var i = 0; i < orcs.length; i += 1) {
	  if (
		hero.x <= (orcs[i].x + 32)
		&& orcs[i].x <= (hero.x + 32)
		&& hero.y <= (orcs[i].y + 32)
		&& orcs[i].y <= (hero.y + 32)
	  ) {
		++orcsCaught;
                destroyOrc(orcs[i]);
//                if (orcsCaught % 10 == 5) {
//                  hoard += 1;
//                }
//                for (var j = 0; j < hoard; j +=1){
                spawnOrc();
//                }
          }
        }
	//hero.health-= 1 
	
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Orcs caught: " + orcsCaught, 32, 32);
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
        for (var i = 0; i < orcs.length; i +=1) {
          orcs[i].update();
          orcs[i].render();
        }
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
initialize();
main();
