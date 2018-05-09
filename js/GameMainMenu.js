/* global MainGameContainer */
MainGameContainer.GameMainMenu = function (game) {};

MainGameContainer.GameMainMenu.prototype = {
  // Game Objects or Groups
  mainMenuBackground: undefined,
  mainMenuLogo: undefined,
  mainMenuStartButton: undefined,
  bgMusic: undefined,

	create: function () {
	  // BG image
	  this.mainMenuBackground = this.add.sprite(0, 0, 'game_bg');
	  
	  // logo image
	  this.mainMenuLogo = this.add.sprite(this.world.centerX, this.world.centerY - 50, 'game_logo');
	  this.mainMenuLogo.anchor.setTo(0.5,0.5);
	  
	  //start button image
	  // this.mainMenuStartButton = this.add.sprite(this.world.centerX, this.world.centerY + 100, 'game_start_button');
	  // this.mainMenuStartButton.anchor.setTo(0.5,0.5);
	  this.mainMenuStartButton = this.add.button(this.world.centerX, this.world.centerY + 100, 'game_start_button', this.handleStartClick, this);
	  this.mainMenuStartButton.anchor.setTo(0.5,0.5);
	  
	  this.bgMusic = this.game.add.audio('blue_beat');
    this.bgMusic.volume = 0.3;
    this.bgMusic.loop = true;
    this.bgMusic.play();
	  
	},

	update: function () {
	},
	
	handleStartClick: function () {
		// load state
		this.bgMusic.stop();
	  this.state.start('GameLevelSelect');
	},

};
