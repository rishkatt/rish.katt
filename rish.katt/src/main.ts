import Phaser from 'phaser'

class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene')
  }

  create() {
    this.add.text(100, 100, 'Hello, Phaser!')
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: GameScene
}

new Phaser.Game(config)