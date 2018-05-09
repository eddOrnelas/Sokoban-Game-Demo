/* global MainGameContainer */
MainGameContainer.GamePlay = function (game) {};

MainGameContainer.GamePlay.prototype = {
  // Game Objects or Groups
  mainMenuBackground: undefined,
  map: undefined,
  bgMusic: undefined,
  moveSound: undefined,
  errorSound: undefined,
  completedSound: undefined,
  levelArray: [],
  player: {
    obj: {},
    posX: 0,
    posY: 0,
    state: 'idle',
    status: 'active',
  },
  boxes: [],
  boxHolders:[],
  returnMenuButton: {},
  restartButton: {},
  returnToLevelSelectButton: {},
  movesText: {},
  completedSprite: {},
  movesDone: 0,
  boxCleared: 0,
  swipeStartX: 0,
  swipeStartY: 0,
  mouseIsDown: false,
  CONSTANTS: {
    FREE: 0,
    WALL: 1,
    BOX: 2,
    HOLDER: 3,
    PLAYER: 4,
    HOLDER_BOX: 5,
    HOLDER_PLAYER: 6,
    TILE_W: 32,
    TILE_H: 32,
    OFFSET_X: 0,
    OFFSET_Y: 0,
    SWIPE_OFFSET: 70,
  },
  gameState: 'preparing',
  
  preload: function () {
    // this.game.load.image("MainMap", "./assets/img/sokoban_tilesheet.png");
    // this.bck = this.add.sprite(this.world.centerX, this.world.centerY, 'main_map');
    // this.game.load.tilemap("Mission1", "assets/maps/Mission1.json", null, Phaser.Tilemap.TILED_JSON);
  },
  shutdown: function() {
    this.game.world.removeAll();
    // reset everything
    this.resetAll();
  },
	create: function () {
	  // BG image
	  this.mainMenuBackground = this.add.sprite(0, 0, 'game_bg');
	  
	  var style = {
      font: "bold 26px Arial",
      fill: "#fff",
      boundsAlignH: "center",
      boundsAlignV: "middle"
    };
    
    // load map
    // window.console.log('Level: ',window.selectedLevel);
    this.map = this.game.add.tilemap("Mission" + window.selectedLevel, 32, 32, 64, 32);
    
    // draw map
    this.map.addTilesetImage("MainMap","main_map");
    this.map.createLayer("Floor");
    this.map.createLayer("Walls");
    // window.console.log('Map: ', this.map);
    
    // translate map to a usable array of solids
    this.initLevelData();
	  
	  // insert sprites to map
	  this.createLevelObjects();
	  
	  this.addUIElements();
	  
	  this.game.input.keyboard.addCallbacks(this,this.onKeyDown);
	  this.startGame();
	},
	update: function () {
	},
	startGame() {
	  
	  //create swipe movement
	  this.game.input.onUp.add(this.mouseUp, this);
    this.game.input.onDown.add(this.mouseDown, this);
	  
	  this.gameState = 'waiting';
	  
	  // game music
	  this.bgMusic = this.game.add.audio('happy_adveture');
    this.bgMusic.volume = 0.3;
    this.bgMusic.loop = true;
    this.bgMusic.play();
    
    // movement sound
    this.moveSound = this.game.add.audio('confirm');
    this.moveSound.volume = 0.5;
    this.moveSound.loop = false;
    
    // error sound
    this.errorSound = this.game.add.audio('error');
    this.errorSound.volume = 0.5;
    this.errorSound.loop = false;
    
    // error sound
    this.completedSound = this.game.add.audio('loadsave');
    this.completedSound.volume = 0.5;
    this.completedSound.loop = false;
	},
	initLevelData() {
	  var mapWidth = this.map.width;
	  var mapHeight = this.map.height;
	  
	  var x = 0;
	  var y = 0;
	  
	  // reset array
	  var tempArray = [];
	  for (y=0; y<mapHeight; y++) {
	    tempArray = [];
	    for (x=0; x<mapWidth; x++) {
	      tempArray.push(0);
	    }
	    this.levelArray.push(tempArray);
	  }
	  
	  // fill array
	  var mapLayers = {
	    floor: [],
	    walls: [],
	    boxHolders: [],
	    box: [],
	    player: [],
	  }
	  
	  // get layer data arrays, some are not required
	  for(x=0; x<this.map.layers.length; x++) {
	    if (this.map.layers[x].name === 'Floor') {
	      mapLayers.floor = this.map.layers[x].data;
	    }
	    if (this.map.layers[x].name === 'Walls') {
	      mapLayers.walls = this.map.layers[x].data;
	    }
	    if (this.map.layers[x].name === 'BoxHolders') {
	      mapLayers.boxHolders = this.map.layers[x].data;
	    }
	    if (this.map.layers[x].name === 'Box') {
	      mapLayers.box = this.map.layers[x].data;
	    }
	    if (this.map.layers[x].name === 'Player') {
	      mapLayers.player = this.map.layers[x].data;
	    }
	  }
	  
	  // window.console.log('mapLayers: ', mapLayers);
	  
	  // fill data
	  for (y=0; y<mapHeight; y++) {
	    for (x=0; x<mapWidth; x++) {
	      // fill walls data
	      if (mapLayers.walls[y][x].index !== -1) {
	        this.levelArray[y][x] = this.CONSTANTS.WALL;
	      }
	      // fill box data
	      if (mapLayers.box[y][x].index !== -1) {
	        this.levelArray[y][x] = this.CONSTANTS.BOX;
	        this.boxes.push({
	          obj: {},
	          posX: x,
	          posY: y,
	          state: 'idle',
            status: 'active',
	        });
	      }
	      // fill holders data
	      if (mapLayers.boxHolders[y][x].index !== -1) {
	        this.levelArray[y][x] = this.CONSTANTS.HOLDER;
	        this.boxHolders.push({
	          obj: {},
	          posX: x,
	          posY: y,
	          state: 'idle',
	          status: 'active',
	        });
	      }
	      // fill player data
	      if (mapLayers.player[y][x].index !== -1) {
	        this.levelArray[y][x] = this.CONSTANTS.PLAYER;
	        this.player.posX = x;
	        this.player.posY = y;
	      }
	    }
	  }
	  
	  window.console.log('Holders', this.boxHolders);
	  
	  // will print a prety array map :D
	  // window.console.log('Map Array: ', this.levelArray);
	},
	createLevelObjects() {
	  
	  //init holders
	  var nHolders = this.boxHolders.length;
	  var x = 0;
	  for (x=0; x<nHolders; x++) {
	    this.boxHolders[x].obj = this.game.add.sprite(
	      this.CONSTANTS.TILE_W*this.boxHolders[x].posX,
	      this.CONSTANTS.TILE_H*this.boxHolders[x].posY,
	      'spritesheet1'
  	  );
	    this.boxHolders[x].obj.animations.add('idle', [40], 4, false);
	    this.boxHolders[x].obj.animations.play('idle');
	  }
	  
	  //init player
	  this.player.obj = this.game.add.sprite(
	    this.CONSTANTS.TILE_W * this.player.posX,
	    this.CONSTANTS.TILE_H * this.player.posY,
	   'spritesheet1'
	  );
	  this.player.obj.animations.add('walk_left', [94, 95, 96], 4, true);
	  this.player.obj.animations.add('walk_right', [91,92, 93], 4, true);
	  this.player.obj.animations.add('walk_up', [68, 69, 70], 4, true);
	  this.player.obj.animations.add('walk_down', [65, 66, 67], 4, true);
	  this.player.obj.animations.add('idle', [65], 4, false);
	  
	  this.player.obj.animations.play('idle');
	  
	  //init boxes
	  var nBoxes = this.boxes.length;
	  var x = 0;
	  for (x=0; x<nBoxes; x++) {
	    this.boxes[x].obj = this.game.add.sprite(
	      this.CONSTANTS.TILE_W*this.boxes[x].posX,
	      this.CONSTANTS.TILE_H*this.boxes[x].posY,
	      'spritesheet1'
  	  );
	    this.boxes[x].obj.animations.add('idle', [1], 4, false);
	    this.boxes[x].obj.animations.play('idle');
	  }
	},
	addUIElements() {
	  this.restartButton = this.game.add.button(gameConfig.width - 125, gameConfig.heigth-100, 'reset_button', this.handleRestarClick, this);
	  this.restartButton.anchor.setTo(0,0);
	  
	  this.returnMenuButton = this.game.add.button(gameConfig.width - 125, gameConfig.heigth-33, 'home_button', this.handleReturnToMenuClick, this);
	  this.returnMenuButton.anchor.setTo(0,0);
	
	  this.returnToLevelSelectButton = this.game.add.button(gameConfig.width - 125, gameConfig.heigth-66, 'levels_button', this.handleReturnToLevelSelectClick, this);
	  this.returnToLevelSelectButton.anchor.setTo(0,0);
	  
	  var stateStyle = {
      align: "center",
      font: "bold 32px Arial",
      fill: "#FFF",
    };
    this.movesText = this.game.add.text(gameConfig.width - 120, 0, 'Moves: \n'+this.movesDone, stateStyle);
    // this.movesText.fill = "#F00";
    this.movesText.setShadow(3, 3, 'rgba(0,0,0,0.3)', 2);
    this.movesText.anchor.setTo(0);
	},
	makeMove(direction) {
	  var posXmod = 0;
	  var posYmod = 0;
	  
	  // direction modifiers
	  if (direction === 'left') {
	    posXmod = -1;
	  }
	  if (direction === 'right') {
	    posXmod = 1;
	  }
	  if (direction === 'up') {
	    posYmod = -1;
	  }
	  if (direction === 'down') {
	    posYmod = 1;
	  }
	  
	  //move player
	  var newPosX = this.player.posX + posXmod;
	  var newPosY = this.player.posY + posYmod;
	  
	  if (this.levelArray[newPosY][newPosX] !== this.CONSTANTS.WALL &&
	  this.levelArray[newPosY][newPosX] !== this.CONSTANTS.BOX && 
	  this.levelArray[newPosY][newPosX] !== this.CONSTANTS.HOLDER_BOX) {
	    //move map variables
	    var oldConstant = this.levelArray[this.player.posY][this.player.posX];
	    if (oldConstant === this.CONSTANTS.HOLDER_PLAYER) {
	      this.levelArray[this.player.posY][this.player.posX] = this.CONSTANTS.HOLDER;
	    } else {
	      this.levelArray[this.player.posY][this.player.posX] = this.CONSTANTS.FREE;
	    }
	    
	    if (this.levelArray[newPosY][newPosX] === this.CONSTANTS.HOLDER) {
	      this.levelArray[newPosY][newPosX] = this.CONSTANTS.HOLDER_PLAYER;
	    } else {
	      this.levelArray[newPosY][newPosX] = this.CONSTANTS.PLAYER;
	    }
	    
	    // move player
	    this.player.obj.x = newPosX * this.CONSTANTS.TILE_W;
	    this.player.obj.y = newPosY * this.CONSTANTS.TILE_H;
	    this.player.posX = newPosX;
	    this.player.posY = newPosY;
	    
	    this.updateMoves(1);
	    this.moveSound.play();
	  } else if(this.levelArray[newPosY][newPosX] === this.CONSTANTS.BOX ||
	  this.levelArray[newPosY][newPosX] === this.CONSTANTS.HOLDER_BOX) {
	    // search box in array
	    var x = 0;
	    var box = {};
	    var arrPos = 0;
	    for (x=0; x<this.boxes.length; x++) {
	      if (this.boxes[x].posX === newPosX && this.boxes[x].posY === newPosY) {
	        box = this.boxes[x];
	        arrPos = x;
	        break;
	      }
	    }
	    
	    // get new position
	    var newBoxPosX = box.posX + posXmod;
	    var newBoxPosY = box.posY + posYmod;
	    
	    //check if box collides with wall or box
	    if (this.levelArray[newBoxPosY][newBoxPosX] !== this.CONSTANTS.BOX &&
	    this.levelArray[newBoxPosY][newBoxPosX] !== this.CONSTANTS.WALL) {
	      window.console.log('Moving Box');
	      //move variables
	      var oldPlayerConstant = this.levelArray[this.player.posY][this.player.posX];
	      var oldBoxConstant = this.levelArray[box.posY][box.posX];
	      
	      //first move box constants so player can check new spot status
	      //check old
	      if (oldBoxConstant === this.CONSTANTS.HOLDER_BOX) {
	        this.levelArray[box.posY][box.posX] = this.CONSTANTS.HOLDER;
	        this.updateBoxCleared(-1);
	      } else {
	        this.levelArray[box.posY][box.posX] = this.CONSTANTS.FREE;
	      }
	      //check new
	      if (this.levelArray[newBoxPosY][newBoxPosX] === this.CONSTANTS.HOLDER) {
	        this.levelArray[newBoxPosY][newBoxPosX] = this.CONSTANTS.HOLDER_BOX;
	        this.updateBoxCleared(1);
	      } else {
	        this.levelArray[newBoxPosY][newBoxPosX] = this.CONSTANTS.BOX;
	      }
	      
	      //then move player constants
	      if (oldPlayerConstant === this.CONSTANTS.HOLDER_PLAYER) {
	        this.levelArray[this.player.posY][this.player.posX] = this.CONSTANTS.HOLDER;
	      } else {
	        this.levelArray[this.player.posY][this.player.posX] = this.CONSTANTS.FREE;
	      }
	      //check new
	      if (this.levelArray[newPosY][newPosX] === this.CONSTANTS.HOLDER) {
	        this.levelArray[newPosY][newPosX] = this.CONSTANTS.HOLDER_PLAYER;
	      } else {
	        this.levelArray[newPosY][newPosX] = this.CONSTANTS.PLAYER;
	      }
  	    
  	    // move player
  	    this.player.obj.x = newPosX * this.CONSTANTS.TILE_W;
  	    this.player.obj.y = newPosY * this.CONSTANTS.TILE_H;
  	    this.player.posX = newPosX;
  	    this.player.posY = newPosY;
  	    
  	    // move box
  	    box.obj.x = newBoxPosX * this.CONSTANTS.TILE_W;
  	    box.obj.y = newBoxPosY * this.CONSTANTS.TILE_H;
  	    box.posX = newBoxPosX;
  	    box.posY = newBoxPosY;
  	    
  	    this.updateMoves(1);
  	    this.moveSound.play();
	    } else {
	      this.errorSound.play();
	    }
	    
	  }
	},
	onKeyDown(e) {
		// if the player is not moving...
		if(this.gameState === 'waiting' && this.player.state === 'idle'){
			switch(e.keyCode){
				// left
				case 37:
					this.makeMove('left');
					break;
				// up
				case 38:
					this.makeMove('up');
					break;
				// right
				case 39:
					this.makeMove('right');
					break;
				// down
				case 40:
					this.makeMove('down');
					break;
			}
		}
	},
	updateBoxCleared(value) {
	  this.boxCleared += value;
	  if (this.boxCleared >= this.boxHolders.length) {
	    this.gameState = 'Finished';
	    setTimeout(()=>{this.checkGameCompleted();}, 500);
	  }
	},
	checkGameCompleted() {
	  this.completedSound.play();
	},
	handleRestarClick() {
	  // remove handlers and reset
	  // this.game.state.clearCurrentState();
	  this.game.state.restart(true,false);
	},
	handleReturnToMenuClick() {
	  // remove handlers and reset
	  // this.game.state.clearCurrentState();
	  this.game.state.start('GameMainMenu',true,false);
	},
	handleReturnToLevelSelectClick() {
	  // remove handlers and reset
	  // this.game.state.clearCurrentState();
	  this.game.state.start('GameLevelSelect',true,false);
	},
	updateMoves(val) {
	  this.movesDone += val;
	  this.movesText.setText('Moves: \n' + this.movesDone);
	},
	mouseDown() {
	  this.mouseIsDown = true;
    this.swipeStartX = this.game.input.x;
    this.swipeStartY = this.game.input.y;
    console.log('Pressing');
	},
	mouseUp() {
	  if (this.mouseIsDown === false) {
	    return false;
	  }
	  this.mouseIsDown = false;
	  var distX = this.game.input.x - this.swipeStartX;
	  var distY = this.game.input.y - this.swipeStartY;
	  
	  if(this.gameState === 'waiting' && this.player.state === 'idle'){
    	    if (distX >= this.CONSTANTS.SWIPE_OFFSET) {
    	      this.makeMove("right");
    	    } else if (distX <= (-this.CONSTANTS.SWIPE_OFFSET)) {
    	      this.makeMove("left");
    	    } else if (distY >= this.CONSTANTS.SWIPE_OFFSET) {
    	      this.makeMove("down");
    	    } else if (distY <= (-this.CONSTANTS.SWIPE_OFFSET)) {
    	      this.makeMove("up");
    	    }
	  }
	  
	  console.log('Release');
	},
	resetAll() {
  	this.mainMenuBackground = undefined;
    this.map = undefined;
    this.levelArray = [];
    this.player = {
      obj: {},
      posX: 0,
      posY: 0,
      state: 'idle',
      status: 'active',
    };
    this.boxes = [];
    this.boxHolders = [];
    this.returnMenuButton = {};
    this.restartButton = {};
    this.returnToLevelSelectButton = {};
    this.movesText = {};
    this.completedSprite = {};
    this.movesDone = 0;
    this.boxCleared = 0;
    this.swipeStartX = 0;
    this.swipeStartY = 0;
    this.mouseIsDown = false;
    this.CONSTANTS = {
      FREE: 0,
      WALL: 1,
      BOX: 2,
      HOLDER: 3,
      PLAYER: 4,
      HOLDER_BOX: 5,
      HOLDER_PLAYER: 6,
      TILE_W: 32,
      TILE_H: 32,
      OFFSET_X: 0,
      OFFSET_Y: 0,
      SWIPE_OFFSET: 70,
    };
    this.gameState = 'preparing';
	}
};
