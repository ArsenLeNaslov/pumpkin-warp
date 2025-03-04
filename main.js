import kaboom from "kaboom"
import loadAssets from "./assets"
import maps from "./maps"

kaboom({
  width: 2000,
  height: 1000,
  background: [0, 0, 0]
})

loadAssets()

const HERO_SPEED = 200
const JUMP_POWER = 1000
const GHOST_SPEED = 100

let level_id = 0
let kills = 0

let ghost_blocks = 0

scene('game', ({ level_id, kills, ghost_blocks }) => {
  add([
    sprite("castle", { width: width(), height: height() }),
    origin('center'),
    pos(width() / 2, height() / 2),
    scale(1),
    fixed()
  ]);

  if (level_id == 0) {
    start_time = time()
  }

  current_map = maps[level_id]

  const level_config = {
    width: 64,
    height: 64,

    '=': () => [
      sprite('rock'),
      'block',
      area(),
      solid(),

    ],
    '^': () => [
      sprite('ghost'),
      'ghost',
      'enemy',
      area(),
      scale(5),
      {
        speed: GHOST_SPEED
      },
    ],
    '*': () => [
      sprite('portalh'),
      'portalh',
      area(),
      scale(5),
    ],
  }

  const level_label = add([
    text('Level ' + level_id),
    pos(0, 0),
    scale(.7),
    color(255, 0, 0),
    fixed(),
  ])

  const blocks_label = add([
    text('Blocks ' + ghost_blocks),
    pos(0, 70),
    scale(.7),
    color(255, 0, 0),
    fixed(),
  ])

  const hero = add([
    sprite('pumpkin'),
    pos(30, 0),
    area(),
    body(),
    scale(6),
    'player'
  ])

  onKeyDown('right', () => {
    hero.move(HERO_SPEED, 0)
  })

  onKeyDown('left', () => {
    hero.move(-HERO_SPEED, 0)
  })

  onKeyDown('space', () => {
    if (hero.grounded()) {
      hero.jump(JUMP_POWER)
    }
  })

  onKeyDown('up', () => {
    if (hero.grounded()) {
      hero.jump(JUMP_POWER)
    }
  })

  hero.collides('enemy', (enemy) => {
    if (enemy.pos.y < hero.pos.y) {
      go('lose')
    } else {
      play("hit")
      kills++
      ghost_blocks++
      blocks_label.text = 'blocks ' + ghost_blocks
      enemy.destroy()
      hero.jump(1000)
    }
  })

  hero.collides('portalh', (p) => {
    p.destroy()
    play("mystic"),
      level_id++
    if (level_id < maps.length) {
      go('game', { level_id, kills, ghost_blocks, start_time })
    } else {
      go('win', { start_time })
    }
  })

  hero.action(() => {
    camPos(hero.pos)
    if (hero.pos.y > 2000) {
      go('lose')
    }
  })

  action('ghost', (g) => {
    g.move(g.speed, 0)

    if (g.pos.x > 1500 || g.pos.x < -100) {
      g.speed = g.speed * -1
    }
  })

  onClick((click_pos) => {
    let world_pos = toWorld(click_pos)
    if (ghost_blocks > 0) {
      ghost_blocks--
      blocks_label.text = 'blocks ' + ghost_blocks
      add([
        sprite('ghost_block'),
        'ghost_block',
        'block',
        pos(world_pos),
        area(),
        solid(),
        scale(2),
      ])
    }
  })

  onKeyPress('b', () => {
    if (ghost_blocks > 0) {
      ghost_blocks--
      blocks_label.text = 'blocks ' + ghost_blocks
      add([
        sprite('ghost_block'),
        'ghost_block',
        'block',
        pos(hero.pos.x, hero.pos.y + 5),
        area(),
        solid(),
        scale(2),
      ])
    }
  })

  const game_level = addLevel(current_map, level_config)
})

scene('lose', () => {
  add([
    sprite("castle", { width: width(), height: height() })
  ]);

  add([
    text('YOU LOSE!', { size: 60, font: "sink" }),
    color(255, 0, 0),
    origin('center'),
    pos(width() / 2, height() / 2),
    layer("ui"),
  ]);

  onKeyPress(() => {
    go('game', {
      level_id: 0,
      kills: 0,
      ghost_blocks: 0
    }
    )
  })
})

scene('win', () => {
  add([
    sprite("castle", { width: width(), height: height() })
  ]);

  add([
    text('YOU WIN!', { size: 60, font: "sink" } + "\nTime: " + (time() - start_time).toFixed(2)),
    color(255, 0, 0),
    origin('center'),
    pos(width() / 2, height() / 2)
  ]);

  onKeyPress(() => {
    go('game', {
      level_id: 0,
      kills: 0,
      ghost_blocks: 0
    }
    )
  })
})

go('game', { level_id, kills, ghost_blocks })