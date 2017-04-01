var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });


function preload() {
    var imageSrc = document.getElementsByTagName('div')[0].className;

    game.load.image('mortal', 'assets/backgrounds/' + imageSrc);
    game.load.image('ground', 'assets/grounds/platform.jpg');
    game.load.image('star', 'assets/items/firstaid.png');
    game.load.image('flameLeft', 'assets/skillsNeffects/flameLeft.png',86,100);
    game.load.image('flameRight', 'assets/skillsNeffects/flameRight.png',86,100);
    game.load.image('buttonRestart', 'assets/items/newGame.png');
    game.load.image('buttonBack', 'assets/items/backMenu.png');
    //Dude1
    game.load.spritesheet('dude', 'assets/heroes/enemy.png', 41.41, 63);
    //Dude2
    game.load.spritesheet('fighter', 'assets/heroes/figher1Movement.png', 40.5, 61);
    game.load.spritesheet('blood', 'assets/skillsNeffects/blood.png',112,120);

}

var player1;
var player2;

var platforms;
var cursors;
var cursors2;

var stars;
var score = 100;
var score2 = 100;
var scoreText;
var proportion = 10; //convert points to health
var bonus = 0;
var bonusPlayer2 = 0;
var facing = 'left';
var flameLeft;
var flameRight;
var blood;

var w = 800,
    h = 600;

function create() {

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    game.add.sprite(0, 0, 'mortal');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 64, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 2);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    //  Now let's create two ledges
    var ledge = platforms.create(400, 400, 'ground');
    ledge.body.immovable = true;

    ledge = platforms.create(-150, 250, 'ground');
    ledge.body.immovable = true;

    // The player1 and its settings
    player1 = game.add.sprite(32, game.world.height - 150, 'fighter');
    player2 = game.add.sprite(32, game.world.height - 550, 'dude');

    //  We need to enable physics on the player1
    game.physics.arcade.enable(player1);
    game.physics.arcade.enable(player2);

    //  player1 physics properties. Give the little guy a slight bounce.
    player1.body.bounce.y = 0.2;
    player1.body.gravity.y = 300;
    player1.body.collideWorldBounds = true;

    player2.body.bounce.y = 0.2;
    player2.body.gravity.y = 300;
    player2.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    player1.animations.add('left', [2, 1, 0], 10, true);
    player1.animations.add('right', [3, 4, 5], 10, true);

    player2.animations.add('left', [3, 4, 5], 10, true);
    player2.animations.add('right', [0, 1, 2], 10, true);

    // Our two animantions, fighting
    player1.animations.add('fightRight', [11, 3], 10);
    player1.animations.add('fightLeft', [6, 2], 10);
    //SkillsAndEffects
    blood = game.add.sprite(4000,4000,'blood');
    game.physics.arcade.enable(blood);
    blood.animations.add('bleed');

    flameRight = game.add.group();
    flameLeft = game.add.group();

    flameRight.enableBody=true;
    flameLeft.enableBody=true;



    player2.animations.add('enemyFightRight', [11, 0], 10);
    player2.animations.add('enemyFightLeft', [6, 5], 10);
    //  Finally some stars to collect
    stars = game.add.group();

    //  We will enable physics for any star that is created in this group
    stars.enableBody = true;

    //  Here we'll create 12 of them evenly spaced apart
    for (var i = 0; i < 12; i++) {
        var r = Math.random();
        //  Create a star inside of the 'stars' group
        var star = stars.create((r * 10) * 90, 40, 'star');

        //  Let gravity do its thing
        star.body.gravity.y = 300;

        //  This just gives each star a slightly random bounce value
        star.body.bounce.y = 0.9 + Math.random() * 0.2;
    }

    //  The score
    scoreText = game.add.text(40, 16, '='.repeat(score / proportion), { fontSize: '32px', fill: '#ff0000' });
    scoreText2 = game.add.text(600, 16, '='.repeat(score2 / proportion), { fontSize: '32px', fill: '#ff0000' });
    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();

    keyLeft = game.input.keyboard.addKey(Phaser.Keyboard.A);
    keyRight = game.input.keyboard.addKey(Phaser.Keyboard.D);
    keyUP = game.input.keyboard.addKey(Phaser.Keyboard.W);
    keyDOWN = game.input.keyboard.addKey(Phaser.Keyboard.S);
    keyFight1 = game.input.keyboard.addKey(Phaser.Keyboard.M);
    keyFightEnemy = game.input.keyboard.addKey(Phaser.Keyboard.F);
}

function update() {

    //  Collide the player1 and the stars with the platforms
    var hitPlatform = game.physics.arcade.collide(player1, platforms);
    hitPlatform = game.physics.arcade.collide(player2, platforms);

    //make player colide !!!!!!!!!!!!!!!!!!!! REMOVEDDD
    // hitPlatform = game.physics.arcade.collide(player1, player2);
    // var hitPlayers = game.physics.arcade.collide(player1,player2)
    //????????????????????????????

    // Creates new game button
    var buttonNewGame= game.add.button(270,150, 'buttonRestart', startNewGame, this);
    buttonNewGame.visible=false;

    var buttonBack= game.add.button(270,280, 'buttonBack', backToMenu, this);
    buttonBack.visible=false;
    game.physics.arcade.collide(stars, platforms);
    // game.physics.arcade.collide(player1,player2)

    //  Checks to see if the player1 overlaps with any of the stars, if he does call the collectStar function
    game.physics.arcade.overlap(player1, stars, collectStar, null, this);
    game.physics.arcade.overlap(player2, stars, collectStar2, null, this);
    //game.physics.arcade.overlap(player2, player1, collectStar2, null, this);

    //  Reset the player1s velocity (movement)
    player1.body.velocity.x = 0;
    player2.body.velocity.x = 0;

    //cursors.addKeys(W,A,S,D);
    if(keyDOWN.isDown&&player2.frame<3){
      var fireBall = flameRight.create(player2.body.x - 30, player2.body.y + 10, 'flameRight');
      fireBall.body.gravity.y = 0;
      fireBall.body.gravity.x = -2000;
    }
    if(keyDOWN.isDown&&player2.frame>2){
      var fireBall2 = flameLeft.create(player2.body.x + 30, player2.body.y + 10, 'flameLeft');
      fireBall2.body.gravity.y = 0;
      fireBall2.body.gravity.x = 2000;
    }
    if (keyLeft.isDown) {
        player2.body.velocity.x = -150;

        bonusPlayer2 = 0;
        player2.animations.play('left');
    } else if (keyRight.isDown) {

        //  Move to the right
        player2.body.velocity.x = 150;

        bonusPlayer2 = -1;
        player2.animations.play('right');
    } else if (keyFightEnemy.isDown) {
      if(Math.abs(player1.body.position.y - player2.body.position.y) < 10){
      blood.body.x = player2.body.x;
      blood.body.y = player2.body.y;
      blood.animations.play('bleed',50,false);
    }
        if (player2.frame == 2) {

            player2.animations.play('enemyFightRight');

        }

        if (player2.frame == 3) {

            player2.animations.play('enemyFightLeft');
        }

        if (Math.abs(player1.body.position.x - player2.body.position.x) < 32 &&
            Math.abs(player1.body.position.y - player2.body.position.y) < 10) {

            score -= 1;
            if (score <= 0) {
                scoreText.text = 'Hero Lose!';
                scoreText2.text = 'Enemy Win!';
                buttonNewGame.visible=true;
                buttonBack.visible=true
                //game.paused = true;
            } else {
                scoreText.text = '-'.repeat(score / proportion);
            }
        }
    } else {

        //  Stand still
        player2.animations.stop();

        player2.frame = 3 + bonusPlayer2;
    }

    //left up down right arrow keys
    if (cursors.left.isDown) {
        //  Move to the left
        player1.body.velocity.x = -150;

        if (facing != 'left') {
            player1.animations.play('left');
            facing = 'left';
        }
    } else if (cursors.right.isDown) {
        //  Move to the right
        player1.body.velocity.x = 150;

        if (facing != 'right') {
            player1.animations.play('right');
            facing = 'right';
        }
    } else if (keyFight1.isDown) {
        if(Math.abs(player1.body.position.y - player2.body.position.y) < 10){
      blood.body.x = player1.body.x;
      blood.body.y = player1.body.y;
      blood.animations.play('bleed',50,false);
}
        if (player1.frame == 3) {

            player1.animations.play('fightRight');
        }

        if (player1.frame == 0) {

            player1.animations.play('fightLeft');
        }

        if (Math.abs(player1.body.position.x - player2.body.position.x) < 32 &&
            Math.abs(player1.body.position.y - player2.body.position.y) < 10) {
            score2 -= 10;

            if (score2 <= 0) {
                scoreText2.text = 'Enemy Lose!';
                scoreText.text = 'Hero Wins!';
                buttonNewGame.visible=true;
                buttonBack.visible=true
                //game.paused = true;
            } else {
                scoreText2.text = '='.repeat(score2 / proportion);
            }
        }
    } else {
        //  Stand still
        if (facing != 'idle') {
            player1.animations.stop();

            if (facing == 'left') {
                player1.frame = 0;
            } else {
                player1.frame = 3;
            }

            facing = 'idle';
        }
    }
    if(cursors.down.isDown&&player1.frame<3){
      var fireBall = flameRight.create(player1.body.x - 30, player1.body.y + 10, 'flameRight');
      fireBall.body.gravity.y = 0;
      fireBall.body.gravity.x = -2000;

  } else if(cursors.down.isDown&&player1.frame>2){
     var fireBall2 = flameLeft.create(player1.body.x + 30, player1.body.y + 10, 'flameLeft');
     fireBall2.body.gravity.y = 0;
     fireBall2.body.gravity.x = 2000;

    }


    //  Allow the player1 to jump if they are touching the ground.
    // if (keyUp.isDown && player2.body.touching.down && hitPlatform) {
    //     player2.body.velocity.y = -350;
    // }
    if (cursors.up.isDown && player1.body.touching.down) {
        player1.body.velocity.y = -350;
    }

    if (keyUP.isDown && player2.body.touching.down) {
        player2.body.velocity.y = -350;
    }

}

function collectStar(player1, star) {

    // Removes the star from the screen
    star.kill();

    //  Add and update the score
    score += 10;

    scoreText.text = '='.repeat(score / proportion);

}

function collectStar2(player2, star) {

    // Removes the star from the screen
    star.kill();

    //  Add and update the score
    score2 += 10;

    scoreText2.text = '='.repeat(score2 / proportion);

}

function startNewGame() {
var mainBackground = document.getElementsByTagName('div')[0];

        if (mainBackground.className === 'apocalypse-1.jpg') {
             window.location = '../GameCore/MortalCombatApocalypse.html';
             } else
             if (mainBackground.className === 'dungeon-2.jpg') {
                 window.location = '../GameCore/MortalCombatDungeonTwo.html';
             } else if (mainBackground.className === 'assets/backgrounds/dungeon-one.jpg') {
                 window.location = "../GameCore/MortalCombatDungeonOne.html";
             } else if (mainBackground.className === 'mortal.jpg') {
                 window.location = '../GameCore/MortalCombat.html';
             } else if (mainBackground.className === 'sky.png') {
                 window.location = '../GameCore/MortalCombatSky.html';
             } else {
                 window.location = '../GameCore/MortalCombat.html';
             }
}

function backToMenu(){
window.location = './Menu.html';
}