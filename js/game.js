// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

//===================================
// VARIABLES
//===================================
var state = "Menu";
var hero;
var orcs = [];
var powerups = [];
var time;
var orcsCaught = 0;
var hoard;
var keysDown = {};
var bgReady = false;
var menuReady = false;
var bgImage;
var menuImage;
//===================================
// GAME - SETUP/UPDATE/RENDER
//===================================

/*-----Setup-----*/

function loadAssets () {

  // Background image
  bgImage = new Image();
  bgImage.onload = function () {
  	bgReady = true;
  };
  bgImage.src = "assets/images/background.png";
  
  // Menu image
  menuImage = new Image();
  menuImage.onload = function () {
  	menuReady = true;
  };
  menuImage.src = "assets/images/menu.png";
  
  addEventListener("keydown", function (e) {
  	keysDown[e.keyCode] = true;
  }, false);
  
  addEventListener("keyup", function (e) {
  	delete keysDown[e.keyCode];
  }, false);


}

/*-----Update-----*/

function updateMenu () {
	if (32 in keysDown) { // Player presses space
		state = "Game";
                initialize();
	}
}

var updateGame = function (modifier) {
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
          orcs[i].x += orcs[i].speed;
        }
        
        // Touching Orcs?
	for (var i = 0; i < orcs.length; i += 1) {
	  if ( touching ( hero, orcs[i] )
	  ) {
		++orcsCaught;
                //destroyOrc(orcs[i]);
                orcs[i].destroy();
                orcs[orcs.length] = new orcObject();
          }
        }

        // Touching Powerup?
	for (var i = 0; i < powerups.length; i += 1) {
	  if ( touching ( hero, powerups[i] )
	  ) {
            switch ( powerups[i].id ) {
              case 0:
                hero.powerUps[hero.powerUps.length] = ["Slow", Date.now()];
                orcs[0].slow();
                break;
              case 1:
                hero.powerUps[hero.powerUps.length] = ["Double", Date.now()];
                  orcs[orcs.length] = new orcObject();
                  orcs[orcs.length] = new orcObject();
                  orcs[orcs.length] = new orcObject();
                break;
            }
                powerups[i].destroy();
                break;
          }
        }
};

/*-----Render-----*/

function renderMenu () {
	if (bgReady) {
		ctx.drawImage(menuImage, 0, 0);
	}

	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("ORC CHASE", 170, 32);
	ctx.fillText("SPACE key to start", 144, 144);
	ctx.fillText("Last game score: " + orcsCaught, 144, 184);
}

function renderGame () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Orcs caught: " + orcsCaught, 32, 72);
	ctx.fillText("Time: " + time, 32, 32);


};

//===================================
// GAME OBJECTS
//===================================

function baseObject () {
}

function sprite (options) {
  baseObject.call(this);         
  this.frameIndex = 0;
  this.tickCount = 0;
  this.ticksPerFrame = options.ticksPerFrame || 0;
  this.numberOfFrames = options.numberOfFrames || 1;
                
  this.x = options.x || 0;
  this.y = options.y || 0;
  this.context = options.context;
  this.width = options.width;
  this.height = options.height;
  this.image = options.image;

  
  this.update = function () {
    this.tickCount += 1;

    if (this.tickCount > this.ticksPerFrame) {
      this.tickCount = 0;
      // If the current frame index is in range
      if (this.frameIndex < this.numberOfFrames - 1) {
        // Go to next frame
        this.frameIndex += 1;
      } else {
        this.frameIndex = 0;
      }
    }
  }
  
  this.render = function () {
    // Draw the animation
    this.context.drawImage(
      this.image,
      this.frameIndex * this.width / this.numberOfFrames,
      0,
      this.width / this.numberOfFrames,
      this.height,
      this.x,
      this.y,
      44,
      44);
  };

  return this;
}

function heroObject () {
  // Create sprite sheet
  var heroImage = new Image();
  heroImage.src = "assets/images/herospritesheet.png"

  // Create Hero sprite object
  sprite.call(this, {
    ticksPerFrame: 16,
    numberOfFrames: 2,
    context: canvas.getContext("2d"),
    width: 88,
    height: 44,
    image: heroImage
  });
  // Add hero-like attributes
  this.speed = 256;
  this.x = canvas.width / 2;
  this.y = canvas.height / 2;
  this.powerUps = []
  
  return this;
}

function powerUpObject (id) {

  var powerUpIndex;
  var powerUpImage = new Image();
  switch (id) {
    case 0:
      powerUpImage.src = "assets/images/slowspritesheet.png"
      break;
    case 1:
      powerUpImage.src = "assets/images/doublespritesheet.png"
      break;
  }

  powerUpIndex = powerups.length;

  // Create Power Up sprite object
  sprite.call(this, {
    ticksPerFrame: 4,
    numberOfFrames: 10,
    context: canvas.getContext("2d"),
    width: 5040,
    height: 512,
    image: powerUpImage
  });  
  this.x = 32 + (Math.random() * (canvas.width - 64));
  this.y = 32 + (Math.random() * (canvas.height - 64));
  this.id = id;

  this.destroy = function () {
    for (var i = 0; i < powerups.length; i += 1) {
      if (powerups[i] === this) {
        powerups[i] = null;
        powerups.splice(i, 1);
        break;
      }
    }
  }
}

function orcObject () {
  
  var orcIndex;
  // Create sprite sheet
  var orcImage = new Image();
  orcImage.src = "assets/images/monsterspritesheet.png";
  orcIndex = orcs.length;
  
  // Create Orc sprite object
  sprite.call(this, {
    ticksPerFrame: 16,
    numberOfFrames: 2,
    context: canvas.getContext("2d"),
    width: 88,
    height: 44,
    image: orcImage
  })
  // Add orc-like attributes
  this.x = 32 + (Math.random() * (canvas.width - 64));
  this.y = 32 + (Math.random() * (canvas.height - 64));
  this.speed = (Math.floor(Math.random() * 6) + 1);

  this.destroy = function () {
    for (var i = 0; i < orcs.length; i += 1) {
      if (orcs[i] === this) {
        orcs[i] = null;
        orcs.splice(i, 1);
        break;
      }
    }

  }
  this.slow = function () {
    for (var i = 0; i < orcs.length; i += 1) {
      orcs[i].speed = orcs[i].speed / 4;
    }
  }
  
  return this;
}

//===================================
// GAME FUNCTIONS
//===================================

var initialize = function () {
        resetGame();
        hero = new heroObject();
        orcs[orcs.length] = new orcObject();
        orcs[orcs.length] = new orcObject();
        orcs[orcs.length] = new orcObject();
        powerups[powerups.length] = new powerUpObject(0);
        powerups[powerups.length] = new powerUpObject(0);
        powerups[powerups.length] = new powerUpObject(1);
        time = 10;

        var timer = setInterval(function(){
          time--;
          if (time == 0) {
            state = "Menu";
            clearInterval(timer);
          }
        },1000);
};

var resetGame = function () {
        orcs.length = 0;
        powerups.length = 0;
        orcsCaught = 0;
}

// Check if two objects are touching
function touching (foo, bar) {
  if (foo.x <= (bar.x + 32)
      && bar.x <= (foo.x + 32)
      && foo.y <= (bar.y + 32)
      && bar.y <= (foo.y + 32)) {
    return true;
  } else {
    return false;
  }
}

// The menu loop
var menuLoop = function () {
        updateMenu();
        renderMenu();
        switch (state) {
          case "Menu":
	    // Switch to menu state
      	    requestAnimationFrame(menuLoop);
            break;

          case "Game":
	    // Request to do this again ASAP
      	    requestAnimationFrame(gameLoop);
            break;
        }
}

// The main game loop
var gameLoop = function () {
	var now = Date.now();
	
	var delta = now - then;
	updateGame(delta / 1000);
	renderGame();

	then = now;

        hero.update();
        hero.render();
        for (var i = 0; i < orcs.length; i +=1) {
          orcs[i].update();
          orcs[i].render();
        }
        for (var i = 0; i < powerups.length; i +=1) {
          powerups[i].update();
          powerups[i].render();
        }
        switch (state) {
          case "Menu":
	    // Switch to menu state
      	    requestAnimationFrame(menuLoop);
            break;

          case "Game":
	    // Request to do this again ASAP
      	    requestAnimationFrame(gameLoop);
            break;
        }
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
loadAssets();
menuLoop();
