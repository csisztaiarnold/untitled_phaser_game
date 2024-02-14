const BootScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:
        function BootScene() {
            Phaser.Scene.call(this, {key: 'BootScene'});
        },
    preload: function () {
        this.load.spritesheet('player', 'assets/character2.png', { frameWidth: 16, frameHeight: 16 });
    },
    create: function () {
        this.scene.start('WorldScene');
    }
});

const WorldScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:
        function WorldScene() {
            Phaser.Scene.call(this, {key: 'WorldScene'});
        },
    preload: function () {
        // map tiles
        this.load.image('base_tiles', 'assets/map.png');
        // map in json format
        this.load.tilemapTiledJSON('tilemap', 'assets/map.json');
    },
    create: function () {

        const map = this.make.tilemap({ key: 'tilemap' })
        const tileset = map.addTilesetImage('Tileset', 'base_tiles')
        const ground = map.createStaticLayer('Ground', tileset);
        const water = map.createStaticLayer('Water', tileset);
        const bridges = map.createStaticLayer('Bridges', tileset);
        const vegetation = map.createStaticLayer('Vegetation', tileset);
        const trees = map.createStaticLayer('Trees', tileset);
        const obstacles = map.createStaticLayer('Obstacles', tileset);
        const foreground = map.createStaticLayer('Foreground', tileset);

        foreground.setDepth(10);
        obstacles.setCollisionByExclusion([-1]);

        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;


        this.player = this.physics.add.sprite(56, 24, 'player', 0);
        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;
        this.player.setCollideWorldBounds(true);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.roundPixels = true;

        this.physics.add.collider(this.player, obstacles);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.player.setCollideWorldBounds(true);
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('player', { frames: [0, 1, 2, 3]}),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('player', { frames: [4, 5, 6, 7]}),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { frames: [8, 9, 10, 11]}),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { frames: [12, 13, 14, 15]}),
            frameRate: 8,
            repeat: -1
        });
    },
    update: function (time, delta)
    {
        this.player.body.setVelocity(0);
        // Horizontal movement
        if (this.cursors.left.isDown)
        {
            this.player.body.setVelocityX(-80);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.body.setVelocityX(80);
        }
        // Vertical movement
        if (this.cursors.up.isDown)
        {
            this.player.body.setVelocityY(-80);
        }
        else if (this.cursors.down.isDown)
        {
            this.player.body.setVelocityY(80);
        }

        if (this.cursors.left.isDown)
        {
            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.anims.play('right', true);
        }
        else if (this.cursors.up.isDown)
        {
            this.player.anims.play('up', true);
        }
        else if (this.cursors.down.isDown)
        {
            this.player.anims.play('down', true);
        }
        else
        {
            this.player.anims.stop();
        }
    }
});

const config = {
    type: Phaser.AUTO,
    width: 320,
    height: 200,
    backgroundColor: '#000',
    parent: 'game-container',
    render: {
        antialias: false,
    },
    zoom: 3,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0}
        }
    },
    scene: [
        BootScene,
        WorldScene
    ]
};
const game = new Phaser.Game(config);