/* global MainGameContainer */
var MainGameContainer = {};

MainGameContainer.GameBoot = function (game) {};

MainGameContainer.GameBoot.prototype = {
  gameAssets: {
    images: [
      { name: 'preloaderBackground', src: './assets/img/preloadbck.png' },
      { name: 'preloaderBar', src: './assets/img/preloadbar.png' },
    ],
    sounds: [],
    music: [],
  },
  preload: function() {
    // load assets
    
    // load image assets
    var x = 0;
    var imagesn = this.gameAssets.images.length;
    
    for (x=0; x<imagesn; x++) {
      this.load.image(
        this.gameAssets.images[x].name,
        this.gameAssets.images[x].src
      );
    }
    
    // load music assets
    var x = 0;
    var soundsn = this.gameAssets.music.length;
    for (x=0; x<soundsn; x++) {
      this.load.audio(
        this.gameAssets.music[x].name,
        this.gameAssets.music[x].src
      );
    }
    
    // load sounds assets
    var x = 0;
    var soundsn = this.gameAssets.sounds.length;
    for (x=0; x<soundsn; x++) {
      this.load.audio(
        this.gameAssets.sounds[x].name,
        this.gameAssets.sounds[x].src
      );
    }
  },
  create: function() {
    // start game and configure extra things
    
    /*if (!this.game.device.desktop) {
      this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
      this.scale.minWidth = 640;
      this.scale.minHeight = 360;
      this.scale.maxWidth = 1280;
      this.scale.maxHeight = 720;
      this.scale.forceLandscape = true;
      this.scale.pageAlignHorizontally = true;
      this.scale.updateLayout(true);
    }*/
    
    this.enterIncorrectOrientation = function(event, message){
    // do stuff here when in incorrect orientation
        console.log('You now have incorrect orientation');
    };

    this.leaveIncorrectOrientation = function(event, message){
        // do stuff here when in correct orientation
         console.log('You now have orientation');
    };
    
    /*if (this.game.device.desktop) {
      this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.scale.minWidth = gameConfig.width/2;
      this.scale.minHeight = gameConfig.heigth/2;
      this.scale.maxWidth = gameConfig.width;
      this.scale.maxHeight = gameConfig.heigth;
      this.scale.pageAlignHorizontally = true;
      this.scale.pageAlignVertically = true;
      this.scale.setScreenSize(true);
    } else {
      this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.scale.minWidth = gameConfig.width/2;
      this.scale.minHeight = gameConfig.heigth/2;
      this.scale.maxWidth = 2048; //You can change this to gameWidth*2.5 if needed
      this.scale.maxHeight = 1228; //Make sure these values are proportional to the gameWidth and gameHeight
      this.scale.pageAlignHorizontally = true;
      this.scale.pageAlignVertically = true;
      this.scale.forceOrientation(true, false);
      this.scale.hasResized.add(this.gameResized, this);
      this.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
      this.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
      this.scale.setScreenSize(true);
    }*/
    
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.pageAlignVertically = true;
    this.scale.pageAlignHorizontally = true;
    this.scale.setShowAll();
    this.scale.refresh();

    this.state.start('GamePreloadMainMenu');
  },
}
