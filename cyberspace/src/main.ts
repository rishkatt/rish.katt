import Phaser from 'phaser'
import testMap from './assets/maps/test-map.json'
import grassImg from './assets/tilesets/grass.png'
import wallImg from './assets/tilesets/wall.png'

class GameScene extends Phaser.Scene {
  
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  player!: Phaser.GameObjects.Arc

  constructor() {
    super('GameScene')
  }

  preload() {
    this.load.tilemapTiledJSON('test-map', testMap)
    this.load.image('grass', grassImg)
    this.load.image('wall', wallImg)
  }

  create() {
    const map = this.make.tilemap({ key: 'test-map' })
    const tileset = map.addTilesetImage('grass', 'grass')
    const wallTileset = map.addTilesetImage('wall', 'wall')
    map.createLayer('Ground', tileset!, 0, 0)
    const collisionLayer = map.createLayer('Collision', wallTileset!, 0, 0)
    collisionLayer!.setCollisionByExclusion([-1])

    // Set camera bounds to match the size of the tilemap
    // This ensures the user does not see outside the map when moving the camera
    this.cameras.main.setBounds(
    0,
    0,
    map.widthInPixels,
    map.heightInPixels
    )
    
    this.player = this.add.circle(640, 360, 20, 0xff0000)
    this.physics.add.existing(this.player)
    this.physics.add.collider(this.player, collisionLayer!)

    this.cursors = this.input.keyboard!.createCursorKeys()
    this.add.text(100, 100, 'Hello, Phaser!')
    this.cameras.main.startFollow(this.player)
  }

  update() {
    const body = this.player.body as Phaser.Physics.Arcade.Body

    body.setVelocity(0)

    if (this.cursors.left.isDown) {
      body.setVelocityX(-200)
    }

    if (this.cursors.right.isDown) {
      body.setVelocityX(200)
    }

    if (this.cursors.up.isDown) {
      body.setVelocityY(-200)
    }

    if (this.cursors.down.isDown) {
      body.setVelocityY(200)
    }
  }

}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,

  physics: {
    default: 'arcade',
    arcade: {
      debug: false // turn this on to see collision boxes for debugging
    }
  },

  scene: GameScene
}

new Phaser.Game(config)