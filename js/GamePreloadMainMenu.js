/* global MainGameContainer */
MainGameContainer.GamePreloadMainMenu = function (game) {};

MainGameContainer.GamePreloadMainMenu.prototype = {
  // Game Objects or Groups
  preloadBar: undefined,
  bck: undefined,
  ready: false,
  // Game Assets
  gameAssets: {
    images: [
      { name: 'game_bg', src: './assets/img/game_bg.png' },
      { name: 'game_logo', src: './assets/img/game_logo.png' },
      { name: 'game_start_button', src: './assets/img/game_start_button.png' },
      { name: 'blue_button', src: './assets/img/blue_button.png' },
      { name: 'blue_button_long', src: './assets/img/blue_button_long.png' },
      { name: 'blue_panel', src: './assets/img/blue_panel.png' },
      { name: 'main_map', src: './assets/img/sokoban_tilesheet.png' },
      { name: 'reset_button', src: './assets/img/reset_button.png' },
      { name: 'home_button', src: './assets/img/home_button.png' },
      { name: 'levels_button', src: './assets/img/levels_button.png' },
    ],
    sounds: [
      { name: 'confirm', src: './assets/sound/confirm.wav' },
      { name: 'error', src: './assets/sound/error.wav' },
      { name: 'loadsave', src: './assets/sound/loadsave.wav' },
    ],
    music: [
      { name: 'blue_beat', src: './assets/music/blue_beat.mp3' },
      { name: 'happy_adveture', src: './assets/music/happy_adveture.mp3' },
      { name: 'jump_run', src: './assets/music/jump_run.mp3' },
    ],
    spritesheets: [
      {name: 'spritesheet1', src: './assets/img/sokoban_tilesheet.png', w:32, h:32}
    ],
  },
	preload: function () {

		//Show the load bar
		this.bck = this.add.sprite(this.world.centerX, this.world.centerY, 'preloaderBackground');
		this.bck.anchor.setTo(0.5,0.5);
		this.bck.scale.setTo(1,1);
		this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'preloaderBar');
		this.preloadBar.anchor.setTo(0,0.5);
		this.preloadBar.scale.setTo(1,1);
		this.preloadBar.x = this.world.centerX - this.preloadBar.width/2;
		
		this.load.setPreloadSprite(this.preloadBar);
		
		//Start loading assets
    
    // load image assets
    var x = 0;
    var imagesn = this.gameAssets.images.length;
    for (x=0; x<imagesn; x++) {
      this.game.load.image(
        this.gameAssets.images[x].name,
        this.gameAssets.images[x].src
      );
    }
    
    // load music assets
    var x = 0;
    var soundsn = this.gameAssets.music.length;
    for (x=0; x<soundsn; x++) {
      this.game.load.audio(
        this.gameAssets.music[x].name,
        this.gameAssets.music[x].src
      );
    }
    
    // load sounds assets
    var x = 0;
    var soundsn = this.gameAssets.sounds.length;
    for (x=0; x<soundsn; x++) {
      this.game.load.audio(
        this.gameAssets.sounds[x].name,
        this.gameAssets.sounds[x].src
      );
    }
    
    // load sprite sheets
    var x = 0;
    var spritesheetsn = this.gameAssets.spritesheets.length;
    for (x=0; x<spritesheetsn; x++) {
      this.load.spritesheet(
        this.gameAssets.spritesheets[x].name,
        this.gameAssets.spritesheets[x].src,
        this.gameAssets.spritesheets[x].w,
        this.gameAssets.spritesheets[x].h,
      );
    }
    
    // load json maps
    this.game.load.tilemap("Mission1", "assets/maps/Mission1.json", null, Phaser.Tilemap.TILED_JSON);
    this.game.load.tilemap("Mission2", "assets/maps/Mission2.json", null, Phaser.Tilemap.TILED_JSON);
    this.game.load.tilemap("Mission3", "assets/maps/Mission3.json", null, Phaser.Tilemap.TILED_JSON);
    this.game.load.tilemap("Mission4", "assets/maps/Mission4.json", null, Phaser.Tilemap.TILED_JSON);
    this.game.load.tilemap("Mission5", "assets/maps/Mission5.json", null, Phaser.Tilemap.TILED_JSON);
	},

	create: function () {
		this.preloadBar.cropEnabled = false;
	},

	update: function () {
		if (this.ready == false)
		{
			this.ready = true;
			this.state.start('GameMainMenu');
		}
	}

};
