import Phaser from 'phaser'
import testMap from './assets/maps/test-map.json'
import testHubMap from './assets/maps/test-hub.json'
import projectsHubMap from './assets/maps/projects-hub.json'
import contactHubMap from './assets/maps/contact-hub.json'
import interestsHubMap from './assets/maps/interests-hub.json'
import grassImg from './assets/tilesets/grass.png'
import wallImg from './assets/tilesets/wall.png'

class GameScene extends Phaser.Scene {
  
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  interactKey!: Phaser.Input.Keyboard.Key
  interactionZones: {
    zone: Phaser.GameObjects.Zone
    action: string
    message: string
    url: string
    targetMap: string
    targetSpawn: string
  }[] = []
  player!: Phaser.GameObjects.Arc
  dialogueText!: Phaser.GameObjects.Text
  canInteract = false
  dialogueOpen = false
  interactionMessage = 'No message found.'
  interactionAction = 'message'
  interactionUrl = ''
  interactionTargetMap = ''
  interactionTargetSpawn = 'entrance'
  currentMapKey = 'test-map'
  currentSpawn = 'entrance'

  constructor() {
    super('GameScene')
  }

  init(data: { mapKey?: string; spawn?: string }) {
    if (data.mapKey) {
      this.currentMapKey = data.mapKey
    }

    if (data.spawn) {
      this.currentSpawn = data.spawn
    }
  }

  preload() {
    this.load.tilemapTiledJSON('test-map', testMap)
    this.load.tilemapTiledJSON('about-hub', testHubMap)
    this.load.tilemapTiledJSON('projects-hub', projectsHubMap)
    this.load.tilemapTiledJSON('contact-hub', contactHubMap)
    this.load.tilemapTiledJSON('interests-hub', interestsHubMap)
    this.load.image('grass', grassImg)
    this.load.image('wall', wallImg)
  }

  create() {
    this.interactionZones = []
    const map = this.make.tilemap({ key: this.currentMapKey })
    const tileset = map.addTilesetImage('grass', 'grass')
    const wallTileset = map.addTilesetImage('wall', 'wall')
    map.createLayer('Ground', tileset!, 0, 0)
    const collisionLayer = map.createLayer('Collision', wallTileset!, 0, 0)
    collisionLayer!.setCollisionByExclusion([-1])

    const spawnPoints = map.getObjectLayer('SpawnPoints')

    const spawnPoint = spawnPoints?.objects.find(
      object => object.name === this.currentSpawn
    )

    const spawnX = spawnPoint?.x ?? 640
    const spawnY = spawnPoint?.y ?? 360

    this.player = this.add.circle(spawnX, spawnY, 20, 0xff0000)
    this.physics.add.existing(this.player)
    this.physics.add.collider(this.player, collisionLayer!)

    const interactables = map.getObjectLayer('Interactables')

    interactables?.objects.forEach(object => {
      const actionProperty = object.properties?.find(
        property => property.name === 'action'
      )

      const messageProperty = object.properties?.find(
        property => property.name === 'message'
      )

      const urlProperty = object.properties?.find(
        property => property.name === 'url'
      )

      const targetMapProperty = object.properties?.find(
        property => property.name === 'targetMap'
      )

      const targetSpawnProperty = object.properties?.find(
        property => property.name === 'targetSpawn'
      )

      const interactionZone = this.add.zone(
        object.x + object.width / 2,
        object.y + object.height / 2,
        object.width,
        object.height
      )

      this.physics.add.existing(interactionZone, true)

      this.interactionZones.push({
        zone: interactionZone,
        action: actionProperty?.value ?? 'message',
        message: messageProperty?.value ?? 'No message found.',
        url: urlProperty?.value ?? '',
        targetMap: targetMapProperty?.value ?? '',
        targetSpawn: targetSpawnProperty?.value ?? 'entrance'
      })

      const debugGraphics = this.add.graphics()

      debugGraphics.lineStyle(2, 0x00ff00)

      debugGraphics.strokeRect(
        object.x,
        object.y,
        object.width,
        object.height
      )
    })

    // Set camera bounds to match the size of the tilemap
    // This ensures the user does not see outside the map when moving the camera
    this.cameras.main.setBounds(
    0,
    0,
    map.widthInPixels,
    map.heightInPixels
    )
    
    this.cursors = this.input.keyboard!.createCursorKeys()
    this.interactKey = this.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.E
    )
    this.add.text(100, 100, 'Hello, Phaser!')
    this.cameras.main.startFollow(this.player)

    this.dialogueText = this.add.text(
      20,
      650,
      '',
      {
        fontSize: '24px',
        color: '#ffffff',
        backgroundColor: '#000000',
        padding: {
          x: 10,
          y: 10
        }
      }
    )

    this.dialogueText.setScrollFactor(0)
    this.dialogueText.setVisible(false)
  }

  update() {
    this.canInteract = false

    for (const interactable of this.interactionZones) {
      if (this.physics.overlap(this.player, interactable.zone)) {
        this.canInteract = true
        this.interactionMessage = interactable.message
        this.interactionAction = interactable.action
        this.interactionUrl = interactable.url
        this.interactionTargetMap = interactable.targetMap
        this.interactionTargetSpawn = interactable.targetSpawn
        break
      }
    }

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

    if (
      this.canInteract &&
      Phaser.Input.Keyboard.JustDown(this.interactKey)
    ) {
      if (this.interactionAction === 'message') {
        if (this.dialogueOpen) {
          this.dialogueText.setVisible(false)
          this.dialogueOpen = false
        } else {
          this.dialogueText.setText(this.interactionMessage)

          this.dialogueText.setVisible(true)
          this.dialogueOpen = true
        }
      }

      if (
        this.interactionAction === 'link' &&
        this.interactionUrl
      ) {
        window.open(this.interactionUrl, '_blank')
      }

      if (
        this.interactionAction === 'transition' &&
        this.interactionTargetMap
      ) {
        this.scene.restart({
              mapKey: this.interactionTargetMap,
              spawn: this.interactionTargetSpawn
        })
      }
    }

    if (
      this.dialogueOpen &&
      (!this.canInteract || this.interactionAction !== 'message')
    ) {
      this.dialogueText.setVisible(false)
      this.dialogueOpen = false
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