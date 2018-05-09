/* global MainGameContainer */
MainGameContainer.GameLevelSelect = function (game) {};

MainGameContainer.GameLevelSelect.prototype = {
  // Game Objects or Groups
  mainMenuBackground: undefined,
  backToMenuButton: undefined,
  levelButtonList: [],
  bgMusic: undefined,
  
  // Component variables
  nLevels: 21,
  columnsPerRow: 7,
  marginLeft: 30,
  marginTop: 30,
  buttonWidth: 50,
  buttonHeight: 50,
  selectedLevel: 0,

  create: function () {
    this.prepareState();
  },
  
  update: function () {
  },
  
  // cutoms
  
  prepareState: function () {
    // BG image
    this.mainMenuBackground = this.add.sprite(0, 0, 'game_bg');
    this.initLevelButtons();
    this.initUIButtons();
    
    this.bgMusic = this.game.add.audio('jump_run');
    this.bgMusic.volume = 0.3;
    this.bgMusic.loop = true;
    this.bgMusic.play();
  },
  
  initLevelButtons: function () {
    // set loop variables
    var y = 1;
    var boxPlaced = 1;
    
    //set text style variables
    var style = {
      font: "bold 30px Arial",
      fill: "#fff",
      boundsAlignH: "center",
      boundsAlignV: "middle"
    };
    
    // Beggin Loop
    for (x=1; x<= this.nLevels; x++) {
      
      // create button
      var levelButton = this.add.button(
        (x*this.buttonWidth) + (x*this.marginLeft),
        (y*this.buttonHeight) + (y*this.marginTop),
        'blue_button',
        this.handleLevelClick,
        this
      );
      
      // center button
      levelButton.anchor.setTo(0.5,0.5);
      // set button extra data
      levelButton.metadatata = {
        level: boxPlaced,
      };
      
      // store button
      this.levelButtonList.push(levelButton);
      
      // create texts
      var text = this.add.text(
        (x*this.buttonWidth) + (x*this.marginLeft),
        (y*this.buttonHeight) + (y*this.marginTop),
        boxPlaced,
        style
      );
      // set more style
      text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
      // center text
      text.anchor.setTo(0.5,0.5);
      
      // rearrange buttons
      if (x % this.columnsPerRow === 0 ) {
        y = y + 1;
        x = 0;
      }
      
      boxPlaced = boxPlaced + 1;
      // exit loop if all buttons placed
      if (boxPlaced > this.nLevels) {
        break;
      }
    }
  },
  
  initUIButtons:  function () {
    
    // init back to menu button
    var backToMenuButton = this.add.button(
        150,
        310,
        'blue_button_long',
        this.handleBackToMenuClick,
        this
      );
      
    // center button
    backToMenuButton.anchor.setTo(0.5,0.5);
    
    var style = {
      font: "bold 26px Arial",
      fill: "#fff",
      boundsAlignH: "center",
      boundsAlignV: "middle"
    };
    
    // create texts
      var text = this.add.text(150, 310, 'Back to Menu', style);
      // set more style
      text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
      // center text
      text.anchor.setTo(0.5,0.5);
  },
  
  
  
  handleLevelClick: function (button) {
    if (button.metadatata.level > 5) {
      alert('Level not implemented');
    } else {
      // load level
      // selectedLevel = button.metadatata.level;
      window.selectedLevel = button.metadatata.level;
      this.bgMusic.stop();
      this.state.start('GamePlay', true,false);
    }
  },
  
  handleBackToMenuClick: function(button) {
    this.bgMusic.stop();
    this.state.start('GameMainMenu');
  },

};
