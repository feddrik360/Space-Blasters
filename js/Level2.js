class Level2 extends Phaser.Scene {
    constructor() {
        super("playGame1");

    }

    create() {
        // Creating the background image.
        let image = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'background');
        let scaleX = this.cameras.main.width / image.width;
        let scaleY = this.cameras.main.height / image.height;
        let scale = Math.max(scaleX, scaleY);
        image.setScale(scale).setScrollFactor(0);
        // All groups.
        this.SaboteurEnemies = this.add.group();
        this.UfoEnemiesLeft = this.add.group();
        this.UfoEnemiesRight = this.add.group();
        this.playerLasers = this.add.group();
        this.enemyLasers = this.add.group();
        // The timers.
        this.laserTimer = 0;
        this.initialTime = 90;
        //keeps the score.
        this.score = 0;
        // Adds the texts for the game.
        this.scoreText = this.add.text(16, 16, 'SCORE: ' + this.score, {fontSize: '30px', fill: '#0f0'});
        this.clock = this.add.text(16, 55, 'TIME LEFT: ' + this.initialTime, {fontSize: '25px', fill: '#0f0'});
        this.target = this.add.text(450, 16, 'TARGET: 600', {fontSize: '30px', fill: '#0f0'});
        this.currentLevel = this.add.text(800, 16, "LEVEL: 2", {fontSize: '30px', fill: '#0f0'});
        Phaser.Display.Align.In.Center(this.target, this.add.zone(500, 35, 100, 650));
        //This creates the player and the cursor keys.
        this.player = this.physics.add.sprite(config.width / 2, 300, 'spaceship').setScale(1.5);
        this.player.setCollideWorldBounds(true); // Making sure the player does not go outside of the game.
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        // The Clock gets updated every second.
        this.time.addEvent({
            delay: 1000,
            callback: function () {

                if (this.initialTime > 0) {
                    this.clockDown()
                }
            },
            callbackScope: this,
            loop: true
        });
        // Allows the enemies to come in from the top.
        this.time.addEvent({
            delay: 2000,
            callback: function () {
                for (var u = 0; u < 3; u++) {
                    this.enemy = new SaboteurGunship(
                        this,
                        Phaser.Math.Between(50, this.game.config.width - 50),
                        0,
                    );
                }
            },
            callbackScope: this,
            loop: true
        });
        // Added in to allow the enemy from the left to spawn.
        this.time.addEvent({
            delay: 7500,
            callback: function () {
                let UfoEnemy = new UfoShipLeft(
                    this,
                    10,
                    Phaser.Math.Between(200, this.game.config.height - 30)
                );
            },
            callbackScope: this,
            loop: true
        });
        // Added in to allow the enemy from the right to spawn.
        this.time.addEvent({
            delay: 7500,
            callback: function () {
                let UfoEnemy = new UfoShipRight(
                    this,
                    990,
                    Phaser.Math.Between(200, this.game.config.height - 30)
                );
            },
            callbackScope: this,
            loop: true
        });
        // Added in for the enemies from the top to shoot.
        this.time.addEvent({
            delay: 1000,
            callback: function () {
                for (var c = 0; c < this.SaboteurEnemies.getChildren().length; c++) {
                    var enemy2 = this.SaboteurEnemies.getChildren()[c];
                    if (Phaser.Math.Between(0, 1500) > 1100) { // So that Enemies can shoot randomly and unpredictably.
                        var enemy3 = new BEAM2(this, enemy2.x, enemy2.y);
                    }
                }
            },
            callbackScope: this,
            loop: true
        });
        // All Overlaps.
        this.physics.add.overlap(this.player, this.enemyLasers, function () {
            this.gameOver();
        }, null, this);

        this.physics.add.overlap(this.player, this.UfoEnemiesLeft, function () {
            this.gameOver();
        }, null, this);
        this.physics.add.overlap(this.player, this.UfoEnemiesRight, function () {
            this.gameOver();
        }, null, this);
        this.physics.add.overlap(this.player, this.SaboteurEnemies, function () {
            this.gameOver();
        }, null, this);
        this.physics.add.overlap(this.enemyLasers, this.playerLasers, function (enemylasers, playerlasers) {
            enemylasers.destroy();
            playerlasers.destroy();
        }, null, this);

        this.physics.add.overlap(this.playerLasers, this.SaboteurEnemies, function (lasers, enemy) {
            enemy.destroy();
            this.IncreaseScore(10);
        }, null, this);

        this.physics.add.overlap(this.playerLasers, this.UfoEnemiesLeft, function (playerLasers, UfoEnemy) {
            UfoEnemy.destroy();
            this.IncreaseScore(5);
        }, null, this);
        this.physics.add.overlap(this.playerLasers, this.UfoEnemiesRight, function (playerLasers, UfoEnemy) {
            UfoEnemy.destroy();
            this.IncreaseScore(5);
        }, null, this);
    }

    update() {
        // Added in for a delay in the shooting.
        this.laserTimer += 1;
        if (Phaser.Input.Keyboard.JustDown(this.spacebar) && (this.laserTimer > 20) && (this.initialTime > 0)) {
            new BEAM(this);
            this.laserTimer = 0;
        }
        // Player movements.
        if (this.cursors.left.isDown) {
            this.player.x -= 5;
        } else if (this.cursors.right.isDown) {
            this.player.x += 5;
        } else if (this.cursors.up.isDown) {
            this.player.y -= 5;
        } else if (this.cursors.down.isDown) {
            this.player.y += 5;
        }
        // To make sure that things dont go outside of the game and cause performance issues.
        for (var i = 0; i < this.playerLasers.getChildren().length; i++) {
            var laser = this.playerLasers.getChildren()[i];
            if (laser.y < 32) {
                laser.destroy();
            }
        }
        for (var d = 0; d < this.enemyLasers.getChildren().length; d++) {
            var enemyLaser = this.enemyLasers.getChildren()[d];
            if (enemyLaser.y > game.config.height - 25) {
                enemyLaser.destroy();
            }
        }

        for (var g = 0; g < this.UfoEnemiesLeft.getChildren().length; g++) {
            var Ufo = this.UfoEnemiesLeft.getChildren()[g];
            if (Ufo.x > game.config.width - 25) {
                Ufo.destroy();
            }
        }
        for (var u = 0; u < this.UfoEnemiesRight.getChildren().length; u++) {
            var UfoRight = this.UfoEnemiesRight.getChildren()[u];
            if (UfoRight.x < 25) {
                UfoRight.destroy();
            }
        }
        for (var c = 0; c < this.SaboteurEnemies.getChildren().length; c++) {
            var enemies = this.SaboteurEnemies.getChildren()[c];
            if (enemies.y > game.config.height - 25) {
                enemies.destroy();
            }
        }
    }

    // Causes the timer to go down and update the timer on screen.
    clockDown() {
        this.initialTime -= 1;
        this.clock.setText('TIME LEFT: ' + this.initialTime);
        if (this.score >= 600) {
            this.NextLevel();
        } else if (this.initialTime === 0 && this.score < 600) {
            this.gameOver();
        }
    }

    // When the player loses.
    gameOver() {
        this.score = 0;
        this.initialTime = 0;
        this.clock.setText('TIME LEFT: ' + this.initialTime);
        this.scoreText.setText('SCORE: ' + this.score);
        this.player.destroy();
        this.gameover = this.add.text(game.config.width / 2, game.config.height / 2, 'GAME OVER', {
            fontSize: '100px',
            fill: '#ff4d4d',
            align: 'center',
        });
        Phaser.Display.Align.In.Center(this.gameover, this.add.zone(500, 325, 100, 650));
        this.time.addEvent({
            delay: 10000,
            callback: function () {
                this.scene.start("bootGame")
            },
            callbackScope: this,
            loop: false
        });
    }

    // When the player goes on to the next level.
    NextLevel() {
        this.initialTime = 0;
        this.clock.setText('TIME LEFT: ' + this.initialTime);
        this.player.destroy();
        this.passLevel = this.add.text(game.config.width / 2, game.config.height / 2, 'YOU HAVE PASSED LEVEL 2!', {
            fontSize: '60px',
            fill: '#0f0',
            align: 'center',
        });
        this.initialTime = 0;
        this.clock.setText('TIME LEFT: ' + this.initialTime);
        const NextLevel = this.add.text(0, 0, "CLICK HERE FOR THE NEXT LEVEL", {
            fontSize: '35px',
            fill: '#0f0',
            align: "center"
        });
        const ReturnToMain = this.add.text(0, 0, "CLICK HERE TO EXIT", {
            fontSize: '35px',
            fill: '#0f0',
            align: "center"
        });
        NextLevel.setInteractive({useHandCursor: true});
        ReturnToMain.setInteractive({useHandCursor: true});
        NextLevel.on('pointerdown', () => {
            // this.scene.start("playGame");
            this.scene.start("playGame2");
        });
        NextLevel.on("pointerover", function () {
            NextLevel.setStyle({fill: '#ff0'});
        }, this);
        NextLevel.on("pointerout", function () {
            NextLevel.setStyle({fill: '#0f0'});
        });
        ReturnToMain.on('pointerdown', () => {
            // this.scene.start("playGame");
            this.scene.start("bootGame");
        });
        ReturnToMain.on("pointerover", function () {
            ReturnToMain.setStyle({fill: '#ff0'});
        }, this);
        ReturnToMain.on("pointerout", function () {
            ReturnToMain.setStyle({fill: '#0f0'});
        });
        Phaser.Display.Align.In.Center(this.passLevel, this.add.zone(500, 250, 100, 650));
        Phaser.Display.Align.In.Center(NextLevel, this.add.zone(500, 350, 100, 650));
        Phaser.Display.Align.In.Center(ReturnToMain, this.add.zone(500, 400, 100, 650));
    }

    // The points to increase every time one of the enemies gets destroyed.
    IncreaseScore(points) {
        if (this.initialTime > 0) {
            this.score += points;
            this.scoreText.setText('SCORE: ' + this.score);
        }
    }
}