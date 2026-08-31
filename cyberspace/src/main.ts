import Phaser from 'phaser'

class GameScene extends Phaser.Scene {
  
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  player!: Phaser.GameObjects.Arc

  constructor() {
    super('GameScene')
  }

  create() {
    this.add.text(100, 100, 'Hello, Phaser!')
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  scene: GameScene
}

new Phaser.Game(config)