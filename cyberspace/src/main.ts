import Phaser from 'phaser'

class GameScene extends Phaser.Scene {
  
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  player!: Phaser.GameObjects.Arc

  constructor() {
    super('GameScene')
  }

  create() {
    this.add.rectangle(640, 360, 1280, 720, 0x87ceeb)
    this.player = this.add.circle(640, 360, 20, 0xff0000)
    this.cursors = this.input.keyboard!.createCursorKeys()
    this.add.text(100, 100, 'Hello, Phaser!')
    this.cameras.main.startFollow(this.player)
  }
  update() {

    if (this.cursors.left.isDown) {
      this.player.x -= 5
    }

    if (this.cursors.right.isDown) {
      this.player.x += 5
    }

    if (this.cursors.up.isDown) {
      this.player.y -= 5
    }

    if (this.cursors.down.isDown) {
      this.player.y += 5
    }

  }

}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  scene: GameScene
}

new Phaser.Game(config)