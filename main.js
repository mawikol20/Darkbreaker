/*
  Dzeko - the Darkbreaker
  Single-file Phaser 3 tactical campaign.
  Designed to run locally by opening index.html.
*/

const ASSETS = {
  music: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_f7d01c1650.mp3?filename=darkness-rising-14822.mp3',
  slash: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_6cc8f78017.mp3?filename=sword-slash-142319.mp3',
  hit: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_ab11f09f95.mp3?filename=impacts-146707.mp3',
  step: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_d8a0098c13.mp3?filename=heavy-footstep-147494.mp3'
};

const GAME_STATE = {
  mapIndex: 0,
  roster: [],
  defeatedCount: 0,
  storyFlags: {
    necromancerRevealed: false,
    betrayalSeen: false
  }
};

const CAMPAIGN = [
  {
    name: 'Map I - Gravewake Outskirts',
    objective: 'Defeat all undead scouts.',
    story: 'A cursed fog swallows the old road. Dzeko carves through the first wave of mindless corpses.',
    playerSpawns: [{ id: 'dzeko', x: 1, y: 3 }],
    enemies: [
      { type: 'zombie', x: 6, y: 1 },
      { type: 'zombie', x: 7, y: 3 },
      { type: 'skeleton', x: 6, y: 5 }
    ],
    join: null
  },
  {
    name: 'Map II - Chapel of Ash',
    objective: 'Protect the relic altar and purge enemies.',
    story: 'Inside a ruined chapel, a fallen knight named Kael pledges his blade to Dzeko.',
    playerSpawns: [{ id: 'dzeko', x: 1, y: 2 }, { id: 'kael', x: 1, y: 4 }],
    enemies: [
      { type: 'zombie', x: 7, y: 1 },
      { type: 'zombie', x: 6, y: 3 },
      { type: 'skeleton', x: 7, y: 5 },
      { type: 'skeleton', x: 5, y: 2 }
    ],
    join: 'kael'
  },
  {
    name: 'Map III - Black Marsh Causeway',
    objective: 'Break through and survive the ambush.',
    story: 'Aria the Hexblade appears from the mist, claiming she hunts the same evil voice.',
    playerSpawns: [{ id: 'dzeko', x: 1, y: 3 }, { id: 'kael', x: 1, y: 5 }, { id: 'aria', x: 1, y: 1 }],
    enemies: [
      { type: 'zombie', x: 6, y: 0 },
      { type: 'zombie', x: 7, y: 2 },
      { type: 'skeleton', x: 6, y: 4 },
      { type: 'skeleton', x: 7, y: 5 },
      { type: 'zombie', x: 5, y: 3 }
    ],
    join: 'aria'
  },
  {
    name: 'Map IV - Warden Crypt',
    objective: 'Defeat the Bone Herald.',
    story: 'The undead stop shambling and begin marching in formation. Someone is commanding them.',
    playerSpawns: [{ id: 'dzeko', x: 1, y: 3 }, { id: 'kael', x: 1, y: 5 }, { id: 'aria', x: 1, y: 1 }],
    enemies: [
      { type: 'skeleton', x: 6, y: 1 },
      { type: 'skeleton', x: 6, y: 3 },
      { type: 'zombie', x: 6, y: 5 },
      { type: 'boneHerald', x: 7, y: 3 }
    ],
    join: null,
    reveal: 'necromancer'
  },
  {
    name: 'Map V - Betrayer\'s Bastion',
    objective: 'Survive betrayal and slay Commander Vorn.',
    story: 'Kael is tempted by dark whispers. Commander Vorn offers immortality. Blood and loyalty collide.',
    playerSpawns: [{ id: 'dzeko', x: 1, y: 2 }, { id: 'kael', x: 2, y: 3 }, { id: 'aria', x: 1, y: 4 }],
    enemies: [
      { type: 'skeleton', x: 6, y: 1 },
      { type: 'skeleton', x: 7, y: 2 },
      { type: 'zombie', x: 6, y: 4 },
      { type: 'vorn', x: 7, y: 5 }
    ],
    join: null,
    reveal: 'betrayal'
  },
  {
    name: 'Final Map - Abyssal Throne',
    objective: 'Defeat Malzar, infinite evil mastermind.',
    story: 'Malzar reveals the war was bait: Dzeko is the last shard of an ancient dark god. End the cycle.',
    playerSpawns: [{ id: 'dzeko', x: 1, y: 3 }, { id: 'kael', x: 1, y: 5 }, { id: 'aria', x: 1, y: 1 }],
    enemies: [
      { type: 'skeleton', x: 6, y: 1 },
      { type: 'zombie', x: 6, y: 5 },
      { type: 'boneHerald', x: 5, y: 3 },
      { type: 'malzar', x: 7, y: 3 }
    ],
    join: null
  }
];

const UNIT_DEFS = {
  dzeko: {
    name: 'Dzeko',
    className: 'Darkbreaker Berserker',
    maxHp: 32,
    atk: 11,
    move: 3,
    range: 1,
    color: 0x1b1c21,
    accent: 0xb41f2d,
    portrait: '⚔️'
  },
  kael: {
    name: 'Kael',
    className: 'Fallen Knight',
    maxHp: 24,
    atk: 8,
    move: 3,
    range: 1,
    color: 0x394150,
    accent: 0x6a80ab,
    portrait: '🛡️'
  },
  aria: {
    name: 'Aria',
    className: 'Hexblade',
    maxHp: 20,
    atk: 9,
    move: 3,
    range: 2,
    color: 0x2d2444,
    accent: 0x8657be,
    portrait: '🔮'
  },
  zombie: {
    name: 'Zombie',
    className: 'Mindless Undead',
    maxHp: 14,
    atk: 5,
    move: 2,
    range: 1,
    color: 0x3f4a38,
    accent: 0x7f9a63,
    portrait: '🧟'
  },
  skeleton: {
    name: 'Skeleton',
    className: 'Bone Servant',
    maxHp: 12,
    atk: 6,
    move: 2,
    range: 1,
    color: 0x56565a,
    accent: 0xcdcfda,
    portrait: '☠️'
  },
  boneHerald: {
    name: 'Bone Herald',
    className: 'Crypt Captain',
    maxHp: 22,
    atk: 8,
    move: 2,
    range: 1,
    color: 0x3b3d52,
    accent: 0xaaccff,
    portrait: '💀'
  },
  vorn: {
    name: 'Commander Vorn',
    className: 'The Betrayer',
    maxHp: 25,
    atk: 9,
    move: 3,
    range: 1,
    color: 0x3e1f2d,
    accent: 0xee4b6a,
    portrait: '🩸'
  },
  malzar: {
    name: 'Malzar',
    className: 'Infinite Evil',
    maxHp: 36,
    atk: 10,
    move: 3,
    range: 2,
    color: 0x1d1129,
    accent: 0xdd39ff,
    portrait: '👑'
  }
};

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 1040,
  height: 640,
  backgroundColor: '#05070d',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [BattleScene]
};

new Phaser.Game(config);

function BattleScene() {
  Phaser.Scene.call(this, { key: 'BattleScene' });
}
BattleScene.prototype = Object.create(Phaser.Scene.prototype);
BattleScene.prototype.constructor = BattleScene;

BattleScene.prototype.preload = function preload() {
  this.load.audio('music', ASSETS.music);
  this.load.audio('slash', ASSETS.slash);
  this.load.audio('hit', ASSETS.hit);
  this.load.audio('step', ASSETS.step);
};

BattleScene.prototype.create = function create() {
  this.cols = 8;
  this.rows = 6;
  this.tileSize = 84;
  this.origin = { x: 70, y: 70 };

  this.turn = 'player';
  this.selectedUnit = null;
  this.units = [];
  this.playerUnits = [];
  this.enemyUnits = [];
  this.highlights = [];
  this.processing = false;

  this.createBackground();
  if (typeof window !== 'undefined') window.__darkbreakerScene = this;
  this.createGrid();
  this.createHud();
  this.createFx();
  this.initAudio();

  if (!GAME_STATE.roster.length) {
    GAME_STATE.roster = ['dzeko'];
  }

  this.loadMap(GAME_STATE.mapIndex);
};

BattleScene.prototype.createBackground = function createBackground() {
  const w = this.cameras.main.width;
  const h = this.cameras.main.height;

  this.add.rectangle(w / 2, h / 2, w, h, 0x090b13);

  const mist = this.add.graphics();
  for (let i = 0; i < 16; i += 1) {
    mist.fillStyle(0x4f5870, 0.09);
    mist.fillEllipse(Phaser.Math.Between(80, w - 80), Phaser.Math.Between(40, h - 120), Phaser.Math.Between(200, 440), Phaser.Math.Between(90, 200));
  }

  this.tweens.add({
    targets: mist,
    alpha: { from: 0.5, to: 0.8 },
    yoyo: true,
    duration: 4200,
    repeat: -1
  });
};

BattleScene.prototype.createGrid = function createGrid() {
  this.gridContainer = this.add.container(0, 0);
  this.tileRects = [];

  for (let y = 0; y < this.rows; y += 1) {
    this.tileRects[y] = [];
    for (let x = 0; x < this.cols; x += 1) {
      const px = this.origin.x + x * this.tileSize;
      const py = this.origin.y + y * this.tileSize;

      const tint = (x + y) % 2 === 0 ? 0x1a1f2f : 0x131728;
      const tile = this.add.rectangle(px, py, this.tileSize - 2, this.tileSize - 2, tint).setOrigin(0);
      tile.setStrokeStyle(1, 0x2e3a58, 0.9);
      tile.setInteractive();
      tile.gridX = x;
      tile.gridY = y;
      tile.on('pointerdown', () => this.onTileClicked(x, y));

      this.gridContainer.add(tile);
      this.tileRects[y][x] = tile;
    }
  }

  this.cursor = this.add.rectangle(0, 0, this.tileSize - 4, this.tileSize - 4).setOrigin(0).setStrokeStyle(2, 0x90b7ff, 0.8).setVisible(false);
};

BattleScene.prototype.createHud = function createHud() {
  const panelX = 760;

  this.add.rectangle(panelX + 140, 320, 280, 640, 0x0f1322, 0.95).setStrokeStyle(2, 0x273151, 1);
  this.titleText = this.add.text(panelX + 18, 16, 'Dzeko - the Darkbreaker', {
    fontSize: '20px',
    color: '#ffffff',
    fontStyle: 'bold'
  });

  this.mapText = this.add.text(panelX + 18, 54, '', { fontSize: '15px', color: '#9eb5e8', wordWrap: { width: 245 } });
  this.objectiveText = this.add.text(panelX + 18, 102, '', { fontSize: '14px', color: '#d7ddf2', wordWrap: { width: 245 } });
  this.storyText = this.add.text(panelX + 18, 165, '', { fontSize: '13px', color: '#bbc6e6', wordWrap: { width: 245 } });

  this.turnText = this.add.text(panelX + 18, 270, 'Turn: Player', { fontSize: '18px', color: '#ffd7d7' });

  this.unitInfo = this.add.text(panelX + 18, 300, 'Select a unit', { fontSize: '14px', color: '#e5ebff', wordWrap: { width: 245 } });

  this.questText = this.add.text(panelX + 18, 420, '', { fontSize: '13px', color: '#cbd8ff', wordWrap: { width: 245 } });

  this.endTurnButton = this.add.rectangle(panelX + 140, 578, 220, 42, 0x6d2331, 1).setStrokeStyle(2, 0xd65c6f, 1).setInteractive();
  this.endTurnText = this.add.text(panelX + 76, 566, 'END TURN', { fontSize: '18px', color: '#fff', fontStyle: 'bold' });

  this.endTurnButton.on('pointerover', () => this.endTurnButton.setFillStyle(0x8e2b3f, 1));
  this.endTurnButton.on('pointerout', () => this.endTurnButton.setFillStyle(0x6d2331, 1));
  this.endTurnButton.on('pointerdown', () => {
    if (!this.processing && this.turn === 'player') {
      this.startEnemyTurn();
    }
  });
};

BattleScene.prototype.createFx = function createFx() {
  this.flash = this.add.rectangle(380, 320, 760, 640, 0xffffff, 0.001).setBlendMode(Phaser.BlendModes.ADD);
  this.bloodParticles = this.add.particles(0, 0, this.makeBloodParticleTexture(), {
    speed: { min: 70, max: 220 },
    lifespan: 320,
    scale: { start: 0.6, end: 0 },
    quantity: 0,
    blendMode: 'ADD'
  });
};

BattleScene.prototype.makeBloodParticleTexture = function makeBloodParticleTexture() {
  const g = this.make.graphics({ x: 0, y: 0, add: false });
  g.fillStyle(0xd2233a, 1);
  g.fillCircle(4, 4, 4);
  g.generateTexture('bloodDot', 8, 8);
  g.destroy();
  return 'bloodDot';
};

BattleScene.prototype.initAudio = function initAudio() {
  this.sound.pauseOnBlur = false;

  this.music = this.cache.audio.exists('music')
    ? this.sound.add('music', { loop: true, volume: 0.25 })
    : null;
  this.sfxSlash = this.cache.audio.exists('slash')
    ? this.sound.add('slash', { volume: 0.4 })
    : null;
  this.sfxHit = this.cache.audio.exists('hit')
    ? this.sound.add('hit', { volume: 0.5 })
    : null;
  this.sfxStep = this.cache.audio.exists('step')
    ? this.sound.add('step', { volume: 0.4 })
    : null;

  this.input.once('pointerdown', () => {
    if (this.music && !this.music.isPlaying) {
      this.music.play();
    }
  });
};


BattleScene.prototype.playSfx = function playSfx(soundRef) {
  if (soundRef) {
    soundRef.play();
  }
};

BattleScene.prototype.loadMap = function loadMap(index) {
  this.clearHighlights();
  this.clearUnits();
  this.selectedUnit = null;
  this.processing = false;

  const map = CAMPAIGN[index];
  this.currentMap = map;

  if (map.join && !GAME_STATE.roster.includes(map.join)) {
    GAME_STATE.roster.push(map.join);
  }

  const activeRoster = GAME_STATE.roster.filter((id) => map.playerSpawns.some((s) => s.id === id));
  activeRoster.forEach((id) => {
    const spawn = map.playerSpawns.find((s) => s.id === id);
    const existing = this.getPersistentUnit(id);
    const unit = this.createUnit(id, spawn.x, spawn.y, 'player', existing);
    this.playerUnits.push(unit);
    this.units.push(unit);
  });

  map.enemies.forEach((enemy) => {
    const unit = this.createUnit(enemy.type, enemy.x, enemy.y, 'enemy');
    this.enemyUnits.push(unit);
    this.units.push(unit);
  });

  this.mapText.setText(map.name);
  this.objectiveText.setText(`Objective: ${map.objective}`);
  this.storyText.setText(map.story);
  this.turnText.setText('Turn: Player');
  this.questText.setText(this.getQuestText());

  this.showDialog(this.getIntroDialog(map));
};

BattleScene.prototype.getPersistentUnit = function getPersistentUnit(id) {
  if (!GAME_STATE.unitProgress) GAME_STATE.unitProgress = {};
  return GAME_STATE.unitProgress[id] || null;
};

BattleScene.prototype.savePersistentUnits = function savePersistentUnits() {
  if (!GAME_STATE.unitProgress) GAME_STATE.unitProgress = {};
  this.playerUnits.forEach((u) => {
    GAME_STATE.unitProgress[u.id] = {
      level: u.level,
      xp: u.xp,
      maxHp: u.maxHp,
      atk: u.atk
    };
  });
};

BattleScene.prototype.createUnit = function createUnit(id, x, y, side, persisted) {
  const def = UNIT_DEFS[id];
  const unit = {
    id,
    side,
    name: def.name,
    className: def.className,
    x,
    y,
    move: def.move,
    range: def.range,
    acted: false,
    moved: false,
    level: persisted?.level || 1,
    xp: persisted?.xp || 0,
    atk: persisted?.atk || def.atk,
    maxHp: persisted?.maxHp || def.maxHp,
    hp: persisted?.maxHp || def.maxHp,
    portrait: def.portrait,
    color: def.color,
    accent: def.accent,
    sprite: null,
    hpText: null,
    aura: null
  };

  const center = this.gridToPixelCenter(x, y);
  unit.aura = this.add.circle(center.x, center.y + 20, 17, side === 'player' ? 0x4e78c9 : 0xb84343, 0.25);
  unit.sprite = this.drawUnitSprite(center.x, center.y, unit);
  unit.hpText = this.add.text(center.x - 18, center.y + 22, `${unit.hp}`, { fontSize: '12px', color: '#f7f9ff', stroke: '#000', strokeThickness: 2 });
  return unit;
};

BattleScene.prototype.drawUnitSprite = function drawUnitSprite(x, y, unit) {
  const g = this.add.graphics({ x, y });

  g.fillStyle(unit.color, 1);
  g.fillRoundedRect(-20, -24, 40, 46, 7);

  g.fillStyle(unit.accent, 1);
  g.fillRect(-5, -32, 10, 18);

  if (unit.id === 'dzeko') {
    g.fillStyle(0x050506, 1);
    g.fillTriangle(-18, -16, 18, -16, 0, 24);
    g.fillStyle(0xced8ff, 1);
    g.fillRect(18, -8, 26, 7);
    g.fillRect(36, -24, 7, 34);
  }

  if (unit.side === 'enemy') {
    g.lineStyle(2, 0x17090a, 1);
    g.strokeRoundedRect(-20, -24, 40, 46, 7);
  }

  return g;
};

BattleScene.prototype.clearUnits = function clearUnits() {
  this.units.forEach((u) => {
    u.sprite.destroy();
    u.hpText.destroy();
    u.aura.destroy();
  });
  this.units.length = 0;
  this.playerUnits.length = 0;
  this.enemyUnits.length = 0;
};

BattleScene.prototype.onTileClicked = function onTileClicked(x, y) {
  if (this.processing || this.turn !== 'player') return;

  const clickedUnit = this.getUnitAt(x, y);

  if (clickedUnit && clickedUnit.side === 'player' && !clickedUnit.acted) {
    this.selectUnit(clickedUnit);
    return;
  }

  if (!this.selectedUnit || this.selectedUnit.acted) return;

  if (clickedUnit && clickedUnit.side === 'enemy') {
    if (this.isInRange(this.selectedUnit, clickedUnit)) {
      const attacker = this.selectedUnit;
      this.performAttack(attacker, clickedUnit, () => this.afterPlayerAction(attacker));
    }
    return;
  }

  if (this.selectedUnit.moved) {
    this.unitInfo.setText('This unit already moved this turn. Attack an enemy in range or end turn.');
    return;
  }

  const moveTiles = this.getWalkableTiles(this.selectedUnit);
  const canMove = moveTiles.some((t) => t.x === x && t.y === y);

  if (canMove) {
    const unit = this.selectedUnit;
    this.moveUnit(unit, x, y, () => {
      unit.moved = true;
      this.clearHighlights();
      this.highlightAttackTargets(unit);
      const canAttackAfterMove = this.enemyUnits.some((enemy) => this.isInRange(unit, enemy));
      if (!canAttackAfterMove) {
        this.unitInfo.setText('No enemy in range after moving. Use END TURN or select another unit.');
      }
    });
  }
};

BattleScene.prototype.selectUnit = function selectUnit(unit) {
  this.selectedUnit = unit;
  this.clearHighlights();
  if (!unit.moved) {
    this.showMoveHighlights(unit);
  }
  this.highlightAttackTargets(unit);

  this.unitInfo.setText([
    `${unit.portrait} ${unit.name} (${unit.className})`,
    `HP ${unit.hp}/${unit.maxHp}`,
    `ATK ${unit.atk}  MOV ${unit.move}  RNG ${unit.range}`,
    `LV ${unit.level}  XP ${unit.xp}/100`,
    unit.id === 'dzeko' && unit.level >= 2 ? 'Skill: Ruin Cleave (AoE splash)' : 'Skill: Basic Brutal Strike',
    unit.moved ? 'Status: Moved (can still attack if in range)' : 'Status: Ready'
  ]);

  const pixel = this.gridToPixel(unit.x, unit.y);
  this.cursor.setPosition(pixel.x + 2, pixel.y + 2).setVisible(true);
};

BattleScene.prototype.showMoveHighlights = function showMoveHighlights(unit) {
  const tiles = this.getWalkableTiles(unit);
  tiles.forEach((t) => {
    const p = this.gridToPixel(t.x, t.y);
    const glow = this.add.rectangle(p.x + this.tileSize / 2, p.y + this.tileSize / 2, this.tileSize - 14, this.tileSize - 14, 0x5382f0, 0.28);
    glow.type = 'move';
    this.highlights.push(glow);
  });
};

BattleScene.prototype.highlightAttackTargets = function highlightAttackTargets(unit) {
  this.enemyUnits.forEach((enemy) => {
    if (this.isInRange(unit, enemy)) {
      const p = this.gridToPixel(enemy.x, enemy.y);
      const mark = this.add.rectangle(p.x + this.tileSize / 2, p.y + this.tileSize / 2, this.tileSize - 20, this.tileSize - 20, 0xdd3040, 0.35);
      mark.type = 'attack';
      this.highlights.push(mark);
    }
  });
};

BattleScene.prototype.clearHighlights = function clearHighlights() {
  this.highlights.forEach((h) => h.destroy());
  this.highlights = [];
};

BattleScene.prototype.getWalkableTiles = function getWalkableTiles(unit) {
  const tiles = [];
  for (let y = 0; y < this.rows; y += 1) {
    for (let x = 0; x < this.cols; x += 1) {
      const dist = Math.abs(unit.x - x) + Math.abs(unit.y - y);
      if (dist > 0 && dist <= unit.move && !this.getUnitAt(x, y)) {
        tiles.push({ x, y });
      }
    }
  }
  return tiles;
};

BattleScene.prototype.isInRange = function isInRange(attacker, target) {
  const dist = Math.abs(attacker.x - target.x) + Math.abs(attacker.y - target.y);
  return dist <= attacker.range;
};

BattleScene.prototype.moveUnit = function moveUnit(unit, x, y, onDone) {
  this.processing = true;
  const center = this.gridToPixelCenter(x, y);

  this.playSfx(this.sfxStep);
  this.tweens.add({
    targets: [unit.sprite, unit.aura, unit.hpText],
    x: (target) => {
      if (target === unit.hpText) return center.x - 18;
      return center.x;
    },
    y: (target) => {
      if (target === unit.aura) return center.y + 20;
      if (target === unit.hpText) return center.y + 22;
      return center.y;
    },
    duration: 220,
    ease: 'Quad.easeInOut',
    onComplete: () => {
      unit.x = x;
      unit.y = y;
      this.processing = false;
      if (onDone) onDone();
    }
  });
};

BattleScene.prototype.performAttack = function performAttack(attacker, target, onDone) {
  this.processing = true;
  this.clearHighlights();

  const start = this.gridToPixelCenter(attacker.x, attacker.y);
  const end = this.gridToPixelCenter(target.x, target.y);
  const dashX = Phaser.Math.Linear(start.x, end.x, 0.55);
  const dashY = Phaser.Math.Linear(start.y, end.y, 0.55);

  this.playSfx(this.sfxSlash);

  let finalized = false;
  const finalizeAttack = () => {
    if (finalized) return;
    finalized = true;

    let impactResolved = false;
    const resolveImpact = () => {
      if (impactResolved) return;
      impactResolved = true;

      try {
        this.flash.setFillStyle(0xffffff, 0.34);
        this.tweens.add({ targets: this.flash, alpha: 0.01, duration: 200 });

        this.playSfx(this.sfxHit);
        this.cameras.main.shake(260, 0.012);
        if (this.bloodParticles && typeof this.bloodParticles.explode === 'function') {
          this.bloodParticles.explode(26, end.x, end.y);
        } else if (this.bloodParticles && typeof this.bloodParticles.emitParticleAt === 'function') {
          this.bloodParticles.emitParticleAt(end.x, end.y, 26);
        }

        // SRW-like big damage scaling: heavy units hit harder.
        const hpScale = Math.floor(attacker.maxHp * 0.28);
        const dmg = Phaser.Math.Between(attacker.atk + hpScale - 3, attacker.atk + hpScale + 4);
        this.applyDamage(attacker, target, Math.max(1, dmg));

        if (attacker.id === 'dzeko' && attacker.level >= 2) {
          this.applyCleaveSplash(attacker, target);
        }
      } catch (err) {
        console.error('Attack resolution error:', err);
      }

      this.processing = false;
      if (onDone) onDone();
    };

    try {
      this.playSuperRobotWarsSequence(attacker, target, resolveImpact);
    } catch (err) {
      console.error('SRW cinematic error:', err);
      resolveImpact();
    }

    this.time.delayedCall(1700, resolveImpact);
  };

  this.tweens.add({
    targets: attacker.aura,
    x: dashX,
    y: dashY + 20,
    duration: 120,
    ease: 'Quad.easeOut',
    yoyo: true,
    repeat: 1
  });

  this.tweens.add({
    targets: attacker.hpText,
    x: dashX - 18,
    y: dashY + 22,
    duration: 120,
    ease: 'Quad.easeOut',
    yoyo: true,
    repeat: 1
  });

  this.tweens.add({
    targets: attacker.sprite,
    x: dashX,
    y: dashY,
    duration: 120,
    ease: 'Quad.easeOut',
    yoyo: true,
    repeat: 1,
    onComplete: finalizeAttack
  });

  this.time.delayedCall(560, finalizeAttack);
};

BattleScene.prototype.playSuperRobotWarsSequence = function playSuperRobotWarsSequence(attacker, target, onDone) {
  const overlay = this.add.container(380, 320).setDepth(3500);

  const veil = this.add.rectangle(0, 0, 760, 640, 0x020308, 0.94);
  const streaks = this.add.graphics();
  for (let i = 0; i < 24; i += 1) {
    const y = -300 + i * 26;
    const alpha = (i % 2 === 0) ? 0.2 : 0.08;
    streaks.fillStyle(i % 2 === 0 ? 0x4b5f96 : 0x992f45, alpha);
    streaks.fillRect(-420, y, 840, 10);
  }

  const upperBand = this.add.rectangle(0, -278, 760, 152, 0x090b15, 0.98);
  const lowerBand = this.add.rectangle(0, 278, 760, 152, 0x090b15, 0.98);

  const attackerFrame = this.add.rectangle(-230, 4, 320, 270, 0x1a2544, 0.96).setStrokeStyle(4, 0x8ab0ff, 0.9);
  const targetFrame = this.add.rectangle(230, -4, 320, 270, 0x40192c, 0.96).setStrokeStyle(4, 0xff8da6, 0.9);

  const attackerAvatar = this.add.circle(-230, 6, 84, 0x2a385f, 1).setStrokeStyle(5, 0xafc8ff, 0.9);
  const targetAvatar = this.add.circle(230, -2, 84, 0x5d2539, 1).setStrokeStyle(5, 0xffadbf, 0.9);

  const attackerIcon = this.add.text(-230, 6, attacker.portrait, { fontSize: '72px' }).setOrigin(0.5);
  const targetIcon = this.add.text(230, -2, target.portrait, { fontSize: '72px' }).setOrigin(0.5);

  const attackerName = this.add.text(-365, -110, `${attacker.name} • ${attacker.className}`, { fontSize: '24px', color: '#e8efff', fontStyle: 'bold' });
  const targetName = this.add.text(86, 92, `${target.name} • ${target.className}`, { fontSize: '24px', color: '#ffe9ee', fontStyle: 'bold' });

  const maxBarW = 250;
  const aHpRatio = Phaser.Math.Clamp(attacker.hp / attacker.maxHp, 0, 1);
  const tHpRatio = Phaser.Math.Clamp(target.hp / target.maxHp, 0, 1);
  const aBarBg = this.add.rectangle(-230, 112, maxBarW, 18, 0x000000, 0.78);
  const tBarBg = this.add.rectangle(230, -112, maxBarW, 18, 0x000000, 0.78);
  const aBar = this.add.rectangle(-230 - (maxBarW * (1 - aHpRatio)) / 2, 112, maxBarW * aHpRatio, 14, 0x52a9ff, 1);
  const tBar = this.add.rectangle(230 - (maxBarW * (1 - tHpRatio)) / 2, -112, maxBarW * tHpRatio, 14, 0xff5f78, 1);

  const aHpText = this.add.text(-348, 128, `HP ${attacker.hp.toString().padStart(4, '0')} / ${attacker.maxHp.toString().padStart(4, '0')}`, { fontSize: '18px', color: '#b8d4ff' });
  const tHpText = this.add.text(102, -96, `HP ${target.hp.toString().padStart(4, '0')} / ${target.maxHp.toString().padStart(4, '0')}`, { fontSize: '18px', color: '#ffbecb' });

  const clash = this.add.text(0, -8, 'FULL BURST', {
    fontSize: '58px',
    color: '#ffffff',
    fontStyle: 'bold',
    stroke: '#2b0000',
    strokeThickness: 9
  }).setOrigin(0.5).setAlpha(0);

  const dmgText = this.add.text(230, -6, '', {
    fontSize: '78px',
    color: '#ffec7a',
    fontStyle: 'bold',
    stroke: '#3a0000',
    strokeThickness: 10
  }).setOrigin(0.5).setAlpha(0);

  overlay.add([
    veil, streaks, upperBand, lowerBand,
    attackerFrame, targetFrame, attackerAvatar, targetAvatar,
    attackerIcon, targetIcon, attackerName, targetName,
    aBarBg, tBarBg, aBar, tBar, aHpText, tHpText,
    clash, dmgText
  ]);

  this.tweens.add({ targets: streaks, x: 44, yoyo: true, repeat: -1, duration: 190, ease: 'Linear' });
  this.tweens.add({ targets: [upperBand, lowerBand], y: '-=88', duration: 170, ease: 'Sine.easeOut' });
  this.tweens.add({ targets: [attackerFrame, attackerAvatar, attackerIcon, attackerName, aBarBg, aBar, aHpText], x: '+=120', duration: 190, ease: 'Cubic.easeOut' });
  this.tweens.add({ targets: [targetFrame, targetAvatar, targetIcon, targetName, tBarBg, tBar, tHpText], x: '-=120', duration: 190, ease: 'Cubic.easeOut' });

  this.time.delayedCall(170, () => {
    this.tweens.add({ targets: clash, alpha: 1, scale: { from: 1.35, to: 1 }, duration: 180, yoyo: true, hold: 200 });
  });

  this.time.delayedCall(360, () => {
    const hpScale = Math.floor(attacker.maxHp * 0.28);
    const previewDamage = Phaser.Math.Between(attacker.atk + hpScale - 3, attacker.atk + hpScale + 4);
    dmgText.setText(`-${Math.max(1, previewDamage)}`);
    this.playSfx(this.sfxHit);
    this.tweens.add({ targets: dmgText, alpha: 1, scale: { from: 2.2, to: 1 }, duration: 220, yoyo: true });
    this.tweens.add({ targets: [targetFrame, targetAvatar, targetIcon, tBar, tHpText], x: '-=20', duration: 60, yoyo: true, repeat: 4 });
  });

  this.time.delayedCall(960, () => {
    this.tweens.add({
      targets: overlay,
      alpha: 0,
      duration: 180,
      onComplete: () => {
        overlay.destroy(true);
        if (onDone) onDone();
      }
    });
  });
};


BattleScene.prototype.applyCleaveSplash = function applyCleaveSplash(attacker, primaryTarget) {
  this.enemyUnits
    .filter((enemy) => enemy !== primaryTarget)
    .forEach((enemy) => {
      const dist = Math.abs(enemy.x - primaryTarget.x) + Math.abs(enemy.y - primaryTarget.y);
      if (dist === 1) {
        this.applyDamage(attacker, enemy, Math.floor(attacker.atk * 0.35));
      }
    });
};

BattleScene.prototype.applyDamage = function applyDamage(attacker, target, dmg) {
  target.hp = Math.max(0, target.hp - dmg);
  if (target.hpText && target.hpText.active) target.hpText.setText(`${target.hp}`);

  const pop = this.add.text((target.sprite?.x || 0) - 8, (target.sprite?.y || 0) - 48, `-${dmg}`, {
    fontSize: '22px',
    color: '#ff6464',
    fontStyle: 'bold',
    stroke: '#1a0000',
    strokeThickness: 4
  });

  this.tweens.add({
    targets: pop,
    y: pop.y - 24,
    alpha: 0,
    duration: 560,
    onComplete: () => pop.destroy()
  });

  this.tweens.add({
    targets: [target.sprite, target.hpText].filter(Boolean),
    x: `+=${Phaser.Math.Between(-8, 8)}`,
    yoyo: true,
    repeat: 2,
    duration: 40
  });

  if (target.hp <= 0) {
    this.killUnit(target);
    if (attacker.side === 'player') this.gainXp(attacker, 35);
  }
};

BattleScene.prototype.gainXp = function gainXp(unit, amount) {
  unit.xp += amount;
  if (unit.xp >= 100) {
    unit.xp -= 100;
    unit.level += 1;
    unit.maxHp += 4;
    unit.hp = unit.maxHp;
    unit.atk += 2;
    unit.hpText.setText(`${unit.hp}`);

    this.showDialog(`${unit.name} reached level ${unit.level}! ATK and HP increased.`);
  }

  if (this.selectedUnit && this.selectedUnit.id === unit.id) {
    this.selectUnit(unit);
  }
};

BattleScene.prototype.killUnit = function killUnit(unit) {
  this.tweens.add({
    targets: [unit.sprite, unit.aura, unit.hpText],
    alpha: 0,
    scale: 0.2,
    duration: 260,
    onComplete: () => {
      unit.sprite.destroy();
      unit.aura.destroy();
      unit.hpText.destroy();
    }
  });

  this.units = this.units.filter((u) => u !== unit);
  if (unit.side === 'player') {
    this.playerUnits = this.playerUnits.filter((u) => u !== unit);
  } else {
    this.enemyUnits = this.enemyUnits.filter((u) => u !== unit);
    GAME_STATE.defeatedCount += 1;
  }
};

BattleScene.prototype.afterPlayerAction = function afterPlayerAction(unit) {
  unit.acted = true;
  unit.moved = true;
  this.selectedUnit = null;
  this.cursor.setVisible(false);
  this.clearHighlights();
  this.unitInfo.setText('Action done. Select another unit or end turn.');

  this.checkBattleState();

  const allActed = this.playerUnits.every((u) => u.acted);
  if (!this.processing && !this.enemyUnits.length) return;
  if (allActed) {
    this.time.delayedCall(200, () => this.startEnemyTurn());
  }
};

BattleScene.prototype.startEnemyTurn = function startEnemyTurn() {
  if (this.processing || this.turn !== 'player') return;

  this.turn = 'enemy';
  this.turnText.setText('Turn: Enemy');
  this.processing = true;

  const enemies = [...this.enemyUnits];
  let idx = 0;

  const next = () => {
    if (idx >= enemies.length || !this.playerUnits.length) {
      this.processing = false;
      this.startPlayerTurn();
      return;
    }

    const enemy = enemies[idx];
    idx += 1;

    if (!this.enemyUnits.includes(enemy)) {
      next();
      return;
    }

    this.enemyAct(enemy, next);
  };

  this.time.delayedCall(350, next);
};

BattleScene.prototype.enemyAct = function enemyAct(enemy, done) {
  try {
    const target = this.getNearestPlayer(enemy);
    if (!target) {
      done();
      return;
    }

    if (this.isInRange(enemy, target)) {
      this.performAttack(enemy, target, () => {
        this.checkBattleState();
        this.time.delayedCall(220, done);
      });
      return;
    }

    const step = this.getStepTowards(enemy, target);
    if (step) {
      this.moveUnit(enemy, step.x, step.y, () => {
        if (this.isInRange(enemy, target)) {
          this.performAttack(enemy, target, () => {
            this.checkBattleState();
            this.time.delayedCall(200, done);
          });
        } else {
          this.time.delayedCall(180, done);
        }
      });
      return;
    }

    done();
  } catch (err) {
    console.error('Enemy action error:', err);
    this.processing = false;
    done();
  }
};

BattleScene.prototype.getNearestPlayer = function getNearestPlayer(enemy) {
  let nearest = null;
  let dist = Infinity;

  this.playerUnits.forEach((p) => {
    const d = Math.abs(enemy.x - p.x) + Math.abs(enemy.y - p.y);
    if (d < dist) {
      dist = d;
      nearest = p;
    }
  });

  return nearest;
};

BattleScene.prototype.getStepTowards = function getStepTowards(unit, target) {
  const candidates = [
    { x: unit.x + 1, y: unit.y },
    { x: unit.x - 1, y: unit.y },
    { x: unit.x, y: unit.y + 1 },
    { x: unit.x, y: unit.y - 1 }
  ].filter((p) => p.x >= 0 && p.x < this.cols && p.y >= 0 && p.y < this.rows && !this.getUnitAt(p.x, p.y));

  candidates.sort((a, b) => {
    const da = Math.abs(a.x - target.x) + Math.abs(a.y - target.y);
    const db = Math.abs(b.x - target.x) + Math.abs(b.y - target.y);
    return da - db;
  });

  return candidates[0] || null;
};

BattleScene.prototype.startPlayerTurn = function startPlayerTurn() {
  this.turn = 'player';
  this.turnText.setText('Turn: Player');
  this.playerUnits.forEach((u) => { u.acted = false; u.moved = false; });
  this.checkBattleState();
};

BattleScene.prototype.checkBattleState = function checkBattleState() {
  if (!this.playerUnits.length) {
    this.showDialog('Dzeko has fallen. Darkness consumes the realm... Reload to try again.');
    this.processing = true;
    return;
  }

  if (!this.enemyUnits.length) {
    this.savePersistentUnits();
    this.time.delayedCall(420, () => this.advanceMap());
  }
};

BattleScene.prototype.advanceMap = function advanceMap() {
  const reveal = this.currentMap.reveal;
  if (reveal === 'necromancer') {
    GAME_STATE.storyFlags.necromancerRevealed = true;
  }
  if (reveal === 'betrayal') {
    GAME_STATE.storyFlags.betrayalSeen = true;
  }

  GAME_STATE.mapIndex += 1;

  if (GAME_STATE.mapIndex >= CAMPAIGN.length) {
    this.showDialog('Malzar is destroyed. Dzeko breaks the curse, but hears a final whisper: "the abyss remembers." Campaign complete!');
    this.turnText.setText('Victory');
    this.processing = true;
    return;
  }

  this.loadMap(GAME_STATE.mapIndex);
};

BattleScene.prototype.getIntroDialog = function getIntroDialog(map) {
  const lines = [map.story];

  if (map.join === 'kael') {
    lines.push('Kael joins your army!');
  }
  if (map.join === 'aria') {
    lines.push('Aria joins your army!');
  }
  if (map.reveal === 'necromancer') {
    lines.push('Plot twist: The dead obey a hidden commander called Malzar.');
  }
  if (map.reveal === 'betrayal') {
    lines.push('Drama: Kael wavers, but chooses Dzeko over Vorn.');
  }

  return lines.join('\n');
};

BattleScene.prototype.getQuestText = function getQuestText() {
  return [
    `Quest: ${this.currentMap.objective}`,
    `Campaign Progress: ${GAME_STATE.mapIndex + 1}/${CAMPAIGN.length}`,
    `Undead Destroyed: ${GAME_STATE.defeatedCount}`,
    `Long Goal: Unmask and kill the infinite evil mastermind.`
  ].join('\n');
};

BattleScene.prototype.showDialog = function showDialog(msg) {
  if (this.dialogBox) {
    this.dialogBox.destroy(true);
  }

  const container = this.add.container(378, 574);
  const bg = this.add.rectangle(0, 0, 720, 112, 0x0c1120, 0.93).setStrokeStyle(2, 0x4f628f, 1);
  const text = this.add.text(-348, -42, msg, { fontSize: '14px', color: '#e5edff', wordWrap: { width: 690 } });
  container.add([bg, text]);

  this.dialogBox = container;
  this.tweens.add({ targets: container, alpha: { from: 0, to: 1 }, y: 562, duration: 200 });

  this.time.delayedCall(3500, () => {
    if (this.dialogBox === container) {
      this.tweens.add({
        targets: container,
        alpha: 0,
        y: 552,
        duration: 240,
        onComplete: () => {
          if (this.dialogBox === container) {
            container.destroy(true);
            this.dialogBox = null;
          }
        }
      });
    }
  });
};

BattleScene.prototype.getUnitAt = function getUnitAt(x, y) {
  return this.units.find((u) => u.x === x && u.y === y);
};

BattleScene.prototype.gridToPixel = function gridToPixel(x, y) {
  return { x: this.origin.x + x * this.tileSize, y: this.origin.y + y * this.tileSize };
};

BattleScene.prototype.gridToPixelCenter = function gridToPixelCenter(x, y) {
  const p = this.gridToPixel(x, y);
  return { x: p.x + this.tileSize / 2, y: p.y + this.tileSize / 2 };
};
